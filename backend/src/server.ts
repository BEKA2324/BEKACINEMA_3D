import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { randomUUID, randomBytes } from 'node:crypto';
import { readFile, writeFile, rename, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const app = express();
app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }));
app.use(express.json({ limit: '1mb' }));
const secret = process.env.JWT_ACCESS_SECRET_KEY || randomBytes(48).toString('hex');
const directory = process.env.CINEVA_DATA_DIR ? process.env.CINEVA_DATA_DIR + '/' : fileURLToPath(new URL('./data/', import.meta.url));
await mkdir(directory, { recursive: true });
for (const [name, initial] of Object.entries({ users: [], user_sessions: [], watchlists: {} })) {
  try { await writeFile(directory + name + '.json', JSON.stringify(initial), { flag: 'wx' }); }
  catch (error: any) { if (error.code !== 'EEXIST') throw error; }
}
async function read(name: string): Promise<any> {
  return JSON.parse(await readFile(directory + name + '.json', 'utf8'));
}
async function save(name: string, value: any) {
  const target = directory + name + '.json';
  await writeFile(target + '.tmp', JSON.stringify(value, null, 2));
  await rename(target + '.tmp', target);
}
// Serialize changes to JSON storage to prevent concurrent requests losing data.
let queue = Promise.resolve();
function change(task: () => Promise<any>) {
  const result = queue.then(task);
  queue = result.then(() => undefined, () => undefined);
  return result;
}
function fail(message: string, status = 400): never { throw Object.assign(new Error(message), { status }); }
const phone = (value: unknown) => String(value || '').replace(/[^0-9]/g, '');
const publicUser = (u: any) => ({ id: u.id, phoneNumber: u.phone_number, email: u.email, name: u.name || '', role: u.role === 'admin' ? 'admin' : 'user', avatar: u.avatar || '' });
function credentials(body: any, registering = false) {
  const number = phone(body.phoneNumber ?? body.phone_number);
  if (!/^998[0-9]{9}$/.test(number)) fail('Telefon raqami +998 bilan boshlanib, 12 ta raqamdan iborat bo‘lsin.');
  if (typeof body.password !== 'string' || body.password.length < 4 || body.password.length > 72) fail('Parol 4–72 ta belgidan iborat bo‘lsin.');
  if (registering && (typeof body.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email))) fail('Email manzil noto‘g‘ri.');
  return number;
}
async function session(user: any) {
  const sessions = await read('user_sessions');
  const id = randomUUID();
  sessions.push({ id, user_id: user.id, is_revoked: false, expires_at: new Date(Date.now() + 86400000).toISOString() });
  await save('user_sessions', sessions);
  return { user: publicUser(user), access_token: jwt.sign({ id: user.id, sid: id }, secret, { expiresIn: '1d' }) };
}
app.get('/api/health', (_req, res) => { res.json({ status: 'ok' }); });
app.post('/api/auth/register', async (req, res) => {
  const number = credentials(req.body || {}, true);
  const result = await change(async () => {
    const users = await read('users');
    const email = req.body.email.trim().toLowerCase();
    if (users.some((u: any) => phone(u.phone_number) === number || u.email?.toLowerCase() === email)) fail('Bu telefon yoki email allaqachon ro‘yxatdan o‘tgan.', 409);
    const user = { id: randomUUID(), phone_number: '+' + number, email, password: await bcrypt.hash(req.body.password, 12) };
    users.push(user);
    await save('users', users);
    return session(user);
  });
  res.status(201).json(result);
});
// Admin password stays on the server; normal registration never assigns roles.
const adminPasswordHash = process.env.CINEVA_ADMIN_PASSWORD ? bcrypt.hashSync(process.env.CINEVA_ADMIN_PASSWORD, 12) : null;
app.post('/api/auth/admin/login', async (req, res) => {
  if (!adminPasswordHash || typeof req.body?.password !== 'string' || !await bcrypt.compare(req.body.password, adminPasswordHash)) fail('Admin paroli noto‘g‘ri.', 401);
  const result = await change(async () => {
    const users = await read('users');
    let admin = users.find((u: any) => u.id === 'cineva-admin' && u.role === 'admin');
    if (!admin) {
      admin = { id: 'cineva-admin', role: 'admin', name: 'Admin', phone_number: '', email: '', avatar: '', password: adminPasswordHash };
      users.push(admin);
      await save('users', users);
    }
    return session(admin);
  });
  res.json(result);
});
app.post('/api/auth/login', async (req, res) => {
  const number = credentials(req.body || {});
  const users = await read('users');
  const user = users.find((u: any) => phone(u.phone_number) === number);
  if (!user || !await bcrypt.compare(req.body.password, user.password)) fail('Telefon raqami yoki parol noto‘g‘ri.', 401);
  res.json(await change(() => session(user)));
});
app.use('/api', async (req: any, _res, next) => {
  const token = req.headers.authorization?.split(' ');
  if (token?.[0] !== 'Bearer' || !token[1]) return next(Object.assign(new Error('Hisobingizga kiring.'), { status: 401 }));
  let payload: any;
  try { payload = jwt.verify(token[1], secret); } catch { return next(Object.assign(new Error('Sessiya tugagan. Qayta kiring.'), { status: 401 })); }
  const sessions = await read('user_sessions');
  const active = sessions.find((s: any) => s.id === payload.sid && s.user_id === payload.id && !s.is_revoked && Date.parse(s.expires_at) > Date.now());
  if (!active) return next(Object.assign(new Error('Sessiya tugagan.'), { status: 401 }));
  req.auth = payload;
  next();
});
app.post('/api/auth/logout', async (req: any, res) => {
  await change(async () => {
    const sessions = await read('user_sessions');
    await save('user_sessions', sessions.map((s: any) => s.id === req.auth.sid ? { ...s, is_revoked: true } : s));
  });
  res.json({ message: 'Hisobdan chiqdingiz.' });
});
app.get('/api/auth/me', async (req: any, res) => {
  const user = (await read('users')).find((u: any) => u.id === req.auth.id);
  if (!user) fail('Foydalanuvchi topilmadi.', 401);
  res.json(publicUser(user));
});
app.patch('/api/auth/me', async (req: any, res) => {
  const result = await change(async () => {
    const users = await read('users');
    const user = users.find((u: any) => u.id === req.auth.id);
    if (!user) fail('Foydalanuvchi topilmadi.', 401);
    const number = phone(req.body?.phoneNumber);
    const email = String(req.body?.email || '').trim().toLowerCase();
    if (!/^998[0-9]{9}$/.test(number) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail('Telefon yoki email noto‘g‘ri.');
    if (users.some((u: any) => u.id !== user.id && (phone(u.phone_number) === number || u.email === email))) fail('Telefon yoki email band.', 409);
    const profile: Record<string, string> = {};
    if (req.body.name !== undefined) {
      if (typeof req.body.name !== 'string' || !req.body.name.trim() || req.body.name.trim().length > 80) fail('Ism 1–80 ta belgidan iborat bo‘lsin.');
      profile.name = req.body.name.trim();
    }
    if (req.body.avatar !== undefined) {
      const avatar = req.body.avatar;
      if (typeof avatar !== 'string' || avatar.length > 500000 || (avatar !== '' && !/^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(avatar))) fail('Profil rasmi noto‘g‘ri yoki juda katta.');
      profile.avatar = avatar;
    }
    Object.assign(user, { phone_number: '+' + number, email, ...profile });
    await save('users', users);
    return publicUser(user);
  });
  res.json(result);
});
app.get('/api/movies', async (_req, res) => { res.json(await read('movies')); });
function movieData(body: any) {
  if (!body || typeof body.title !== 'string' || !body.title.trim() || typeof body.description !== 'string' || !body.description.trim()) fail('Film nomi va tavsifi kerak.');
  if (!['movie', 'series'].includes(body.type) || !['Fantastika', 'Triller', 'Drama', 'Sarguzasht', 'Animatsiya'].includes(body.genre)) fail('Janr yoki turi noto‘g‘ri.');
  if (!String(body.rating).trim() || !Number.isFinite(Number(body.rating)) || Number(body.rating) < 0 || Number(body.rating) > 10) fail('Reyting 0–10 orasida bo‘lsin.');
  if (!/^\d{4}$/.test(String(body.year))) fail('Yil 4 ta raqamdan iborat bo‘lsin.');
  if (body.poster && !/^https?:\/\//.test(body.poster)) fail('Poster HTTP yoki HTTPS manzil bo‘lsin.');
  return Object.fromEntries(['title', 'description', 'genre', 'type', 'rating', 'year', 'duration', 'quality', 'director', 'poster'].map(key => [key, String(body[key] ?? '').trim()]));
}
// Resolve permissions from stored user data for every catalog mutation.
app.use('/api/movies', async (req: any, _res, next) => {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    const user = (await read('users')).find((u: any) => u.id === req.auth.id);
    if (user?.role !== 'admin') fail('Bu amal faqat admin uchun.', 403);
  }
  next();
});
app.post('/api/movies', async (req, res) => {
  const movie = { ...movieData(req.body), id: randomUUID() };
  await change(async () => { const movies = await read('movies'); movies.push(movie); await save('movies', movies); });
  res.status(201).json(movie);
});
app.put('/api/movies/:id', async (req, res) => {
  const data = movieData(req.body);
  const result = await change(async () => {
    const movies = await read('movies');
    const movie = movies.find((m: any) => m.id === req.params.id);
    if (!movie) fail('Film topilmadi.', 404);
    Object.assign(movie, data); await save('movies', movies); return movie;
  });
  res.json(result);
});
app.delete('/api/movies/:id', async (req, res) => {
  await change(async () => {
    const movies = await read('movies');
    if (!movies.some((m: any) => m.id === req.params.id)) fail('Film topilmadi.', 404);
    await save('movies', movies.filter((m: any) => m.id !== req.params.id));
    const lists = await read('watchlists');
    for (const key of Object.keys(lists)) lists[key] = lists[key].filter((id: string) => id !== req.params.id);
    await save('watchlists', lists);
  });
  res.status(204).end();
});
app.get('/api/watchlist', async (req: any, res) => { res.json((await read('watchlists'))[req.auth.id] || []); });
app.put('/api/watchlist/:id', async (req: any, res) => {
  const result = await change(async () => {
    if (!(await read('movies')).some((m: any) => m.id === req.params.id)) fail('Film topilmadi.', 404);
    const lists = await read('watchlists');
    const ids: string[] = lists[req.auth.id] || [];
    lists[req.auth.id] = ids.includes(req.params.id) ? ids.filter(id => id !== req.params.id) : [...ids, req.params.id];
    await save('watchlists', lists); return lists[req.auth.id];
  });
  res.json(result);
});
app.use((_req, res) => { res.status(404).json({ message: 'API manzili topilmadi.' }); });
app.use((error: any, _req: any, res: any, _next: any) => {
  const status = Number.isInteger(error.status) ? error.status : 500;
  if (status >= 500) console.error(error);
  res.status(status).json({ message: status >= 500 ? 'Serverda xatolik yuz berdi.' : error.message });
});
app.listen(Number(process.env.PORT) || 3000, '127.0.0.1', () => console.log('CINEVA API ready'));
