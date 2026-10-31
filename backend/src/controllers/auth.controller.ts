// Express freymvorkidan so'rov va javob obyektlari tiplari
import type { Request, Response } from "express";
// Biznes mantig'iga ega AuthService servisi
import { AuthService } from "../services/auth.service.ts";
// Qurilma ma'lumotlarini o'qish uchun vosita
import { UAParser } from "ua-parser-js";

// HTTP so'rovlarini qabul qilib, ularga javob qaytaruvchi kontroller klassi
export class AuthController {
  // Konstruktor orqali AuthService nusxasini qabul qilib, o'zgaruvchiga biriktiramiz
  constructor(public authService: AuthService) {}
  // Kirish (Login) so'rovini qabul qiluvchi asinxron metod
  async login(req: Request, res: Response) {
    try {
      // Mijoz yuborgan ma'lumotlarni (telefon raqam va parol) so'rov tanasidan olamiz
      const payload = req.body;
      // Servisga ma'lumotlarni va butun so'rovni (user-agent tahlili uchun) yuboramiz
      const token = await this.authService.loginService(payload, req);
      // Muvaffaqiyatli olingan tokenlarni mijozga JSON shaklida qaytaramiz
      res.json(token);
    } catch (error: any) {
      // Agar servisda xatolik bo'lsa, HTTP status kodini (masalan: 401) belgilaymiz
      res.statusCode = error.code;
      // Xatolik xabarini mijozga JSON ko'rinishida jo'natamiz
      res.json({
        message: error.message,
      });
    }
  }
  // Ro'yxatdan o'tish (Register) so'rovini qabul qiluvchi asinxron metod
  async register(req: Request, res: Response) {
    try {
      // Mijoz formadan yuborgan ma'lumotlarni qabul qilamiz
      const payload = req.body;
      // Servisning ro'yxatga olish metodini chaqirib, tokenlarni kutamiz
      const token = await this.authService.registerService(payload);
      // Muvaffaqiyatli tokenlarni mijozga JSON formatida qaytaramiz
      res.json(token);
    } catch (error: any) {
      // Xatolik yuz bersa, uning maxsus kodini belgilaymiz (masalan: 409)
      res.statusCode = error.code;
      // Xatolik sababini mijozga qaytaramiz
      res.json({
        message: error.message,
      });
    }
  }
  // Tizimdan chiqish (Logout) so'rovi uchun metod
  async logout(req: Request, res: Response) {
    try {
      // Kelgusida bu yerda seansni o'chirish kodi yoziladi
    } catch (error) {
      // Xatolik bo'lsa konsolga yozamiz
      console.log(error);
    }
  }
}
