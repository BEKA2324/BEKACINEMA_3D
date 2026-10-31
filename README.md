# BEKACINEMA

Frontend va backend bitta repositoryda. Node.js 22+ kerak.

Backend (birinchi terminal):

```powershell
cd backend
npm ci
Copy-Item .env.example .env
# .env ichidagi JWT_ACCESS_SECRET_KEY va CINEVA_ADMIN_PASSWORD qiymatlarini o‘rnating.
npm run dev
```

Frontend (ikkinchi terminal, loyiha ildizidan):

```powershell
npm ci
Copy-Item .env.example .env
npm run dev
```

`.env`, `node_modules`, `dist`, foydalanuvchilar va sessiyalar Gitga kiritilmaydi. Yangi backend bo‘sh hisoblar bazasini avtomatik yaratadi. Admin paroli faqat `backend/.env` orqali o‘rnatiladi.

The 3D bee lives in `src/components/CinemaBee.jsx`; its original animated model is in `public/models/demon_bee_full_texture.glb`.
The bee appears on the public `/about` page, reached through the footer. `/about#support` opens the help section. Three.js and GSAP load when the about page mounts; the home page has no 3D overlay. Pointer movement turns the bee, and the corner button hides it. Reduced motion pauses model animation.
Liquid glass styles are in `src/index.css`. Edit `src`, then run `npm.cmd run build`; `dist` is generated output.

Backend: `backend/`.

Run the backend in its folder with `npm.cmd run dev`, then run this frontend with `npm.cmd run dev`.
Open http://localhost:5173 and register a new account. Login requires an existing registered account.

The API defaults to http://localhost:4000/api, matching the backend PORT=4000 setting. Copy `.env.example` to `.env` to configure another address.
The home route requires a valid session. Logout revokes the server session and redirects to `/login`.
Registration/login/profile/catalog actions display a liquid glass toast.
Catalog changes persist on the backend; saved movies belong to each user.

`npm.cmd run build` validates the production build.
The backend includes API tests: `npm.cmd test` and `npm.cmd run typecheck`.
`browser-check.cjs` is an optional Playwright check (requires Playwright and installed Edge):

    node browser-check.cjs ./backend

Start this frontend on port 5173 before running the browser check. It starts an isolated API on port 3002.
The video player remains a visual preview; actual movie streaming is not implemented.
