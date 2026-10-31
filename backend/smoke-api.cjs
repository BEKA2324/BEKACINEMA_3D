const { spawn } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const assert = require('node:assert/strict');
const backend = process.argv[2] || __dirname;
const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'cineva-test-'));
const adminPassword = 'isolated-admin-test-password';
for (const name of ['users', 'user_sessions', 'movies', 'watchlists']) fs.writeFileSync(path.join(directory, name + '.json'), name === 'movies' ? fs.readFileSync(path.join(backend, 'src/data/movies.json')) : name === 'watchlists' ? '{}' : '[]');
const server = spawn(process.execPath, ['--import', 'tsx', 'src/server.ts'], { cwd: backend, env: { ...process.env, PORT: '3001', CINEVA_DATA_DIR: directory, CINEVA_ADMIN_PASSWORD: adminPassword }, stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true });
let token;
async function request(route, method = 'GET', body, expected = 200) {
 const response = await fetch('http://localhost:3001/api' + route, { method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
 const result = response.status === 204 ? null : await response.json();
 assert.equal(response.status, expected, JSON.stringify(result));
 return result;
}
(async () => {
 try {
  await new Promise((resolve, reject) => { server.stdout.once('data', resolve); server.once('error', reject); server.once('exit', code => reject(new Error('Server exit ' + code))); server.stderr.on('data', value => process.stderr.write(value)); });
  await request('/health');
  await request('/movies', 'GET', undefined, 401);
  const credentials = { phoneNumber: '+998 90 123 45 67', email: 'test@example.com', password: 'test1234' };
  await request('/auth/register', 'POST', { ...credentials, email: 'invalid' }, 400);
  const registered = await request('/auth/register', 'POST', credentials, 201);
  assert.equal(registered.user.phoneNumber, '+998901234567'); assert.equal(registered.user.password, undefined);
  await request('/auth/register', 'POST', credentials, 409);
  await request('/auth/login', 'POST', { ...credentials, password: 'wrong' }, 401);
  const login = await request('/auth/login', 'POST', credentials); token = login.access_token;
  assert.equal((await request('/auth/me')).email, credentials.email);
  await request('/auth/me', 'PATCH', { phoneNumber: credentials.phoneNumber, email: 'updated@example.com' });
  assert.equal((await request('/auth/me')).email, 'updated@example.com');
  const movies = await request('/movies'); assert.equal(movies.length, 8);
  await request('/watchlist/' + movies[0].id, 'PUT'); assert.equal((await request('/watchlist')).length, 1);
  assert.equal((await request('/auth/me')).role, 'user');
  await request('/movies', 'POST', movies[0], 403);
  await request('/movies/' + movies[0].id, 'PUT', movies[0], 403);
  await request('/movies/' + movies[0].id, 'DELETE', undefined, 403);
  await request('/auth/me', 'PATCH', { phoneNumber: credentials.phoneNumber, email: 'updated@example.com', role: 'admin' });
  assert.equal((await request('/auth/me')).role, 'user');
  await request('/auth/admin/login', 'POST', { password: 'wrong' }, 401);
  const admin = await request('/auth/admin/login', 'POST', { password: adminPassword });
  token = admin.access_token;
  assert.equal(admin.user.role, 'admin');
  assert.equal((await request('/auth/me')).role, 'admin');
  const movie = await request('/movies', 'POST', { ...movies[0], title: 'API test' }, 201);
  await request('/movies/' + movie.id, 'PUT', { ...movie, title: 'Updated test' });
  await request('/watchlist/' + movie.id, 'PUT');
  await request('/movies/' + movie.id, 'DELETE', undefined, 204);
  assert.equal((await request('/watchlist')).includes(movie.id), false);
  const stored = JSON.parse(fs.readFileSync(path.join(directory, 'users.json'))); assert.notEqual(stored[0].password, credentials.password);
  await request('/auth/logout', 'POST'); await request('/auth/me', 'GET', undefined, 401);
  console.log('PASS: registration, validation, duplicate, wrong password, login, profile, catalog, CRUD, watchlist cleanup, password hash, logout token revocation. Test data isolated at ' + directory);
 } finally { server.kill(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
