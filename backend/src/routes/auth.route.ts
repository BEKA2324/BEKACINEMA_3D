// Express kutubxonasidan alohida router yaratuvchi Router funksiyasini olamiz
import { Router } from "express";
// So'rovlarni qayta ishlovchi AuthController klassi
import { AuthController } from "../controllers/auth.controller.ts";
// Biznes mantig'ini bajaruvchi AuthService klassi
import { AuthService } from "../services/auth.service.ts";

// Autentifikatsiya yo'nalishlarini birlashtiruvchi router obyekti
export const AuthRouter = Router();

// Yangi servis yaratib, uni kontrollerga bergan holda yangi kontroller nusxasini hosil qilamiz
const authController = new AuthController(new AuthService());

// /api/auth/register manziliga kelgan POST so'rovini register metodiga bog'laymiz
AuthRouter.post(
  "/api/auth/register",
  // .bind() orqali metod ichidagi 'this' aynan authController bo'lishini ta'minlaymiz
  authController.register.bind(authController),
);
// /api/auth/login manziliga POST so'rovi kelganda login metodini chaqiramiz
AuthRouter.post("/api/auth/login", authController.login.bind(authController));
// /api/auth/logout manziliga POST so'rovi kelganda logout metodini chaqiramiz
AuthRouter.post("/api/auth/logout", authController.logout.bind(authController));
