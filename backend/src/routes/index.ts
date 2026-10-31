// Alohida yozilgan autentifikatsiya routerini chaqiramiz
import { AuthRouter } from "./auth.route.ts";

// Serverdagi barcha yo'nalishlar to'plamini massiv shaklida qaytaruvchi funksiya
const Routes = () => [AuthRouter];

// Funksiyani standart eksport qilamiz
export default Routes;
