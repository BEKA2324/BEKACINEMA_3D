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
The public `/about` page contains a liquid glass 3D library with the bee and butterfly. Each card has a live preview and a larger viewer with orbit/zoom and pause/play controls. `/about#support` opens the help section. Three.js loads dynamically; previews pause outside the viewport and while the model dialog is open. Reduced motion starts playback paused.
The home page has a separate animated butterfly overlay (`ButterflyFlight.jsx`): five clones on desktop, two on mobile. The overlay lets clicks pass through; its bottom-left button hides it. It starts disabled for reduced motion. The model is loaded once per mount, with shared geometry/textures and independent skeleton animations.
Liquid glass styles are in `src/index.css`. Edit `src`, then run `npm.cmd run build`; `dist` is generated output.
The sun/moon button switches between light and dark themes on every main page. The selection is saved in `bekacinema_theme`; a first visit follows the system theme. The initial theme is applied before React renders to avoid a light flash.

Backend: `backend/`.

Run the backend in its folder with `npm.cmd run dev`, then run this frontend with `npm.cmd run dev`.
Open http://localhost:5173 and register a new account. Login requires an existing registered account.

The API defaults to http://localhost:4000/api, matching the backend PORT=4000 setting. Copy `.env.example` to `.env` to configure another address.
The home route requires a valid session. Logout revokes the server session and redirects to `/login`.
Registration/login/profile/catalog actions display a liquid glass toast.
Catalog changes persist on the backend; saved movies belong to each user.

`npm.cmd run build` validates the production build.
The backend includes API tests: `npm.cmd test` and `npm.cmd run typecheck`.
The catalog contains Marvel movie/series recommendations with official YouTube trailers. Hovering a card plays a muted four-second preview; clicking opens the native YouTube player with real playback, volume, seek and fullscreen controls. Full movies/episodes are not hosted here. Scores are BEKA recommendations, not IMDb ratings.

Publication remains paused until requested.
