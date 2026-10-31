// Parollarni xesh qilish va solishtirish uchun bcrypt kutubxonasi
import bcrypt from "bcrypt";
// users.json ma'lumotlar bazasini o'qish va yozish uchun yordamchi funksiyalar
import { readFileAsync, writeFileAsync } from "../utils/file-system.ts";
// Foydalanuvchi obyekti uchun TypeScript interfeysi
import type { IUser } from "../types/user.type.ts";
// jsonwebtoken kutubxonasidan amal qilish muddati tipi
import type { SignOptions } from "jsonwebtoken";
// Login va Register shakllari uchun interfeyslar
import type { ILogin, IRegister } from "../types/auth.type.ts";
// JWT token generatsiya qiluvchi funksiya
import { generateToken } from "../utils/jwt.ts";
// Mijoz qurilmasi va brauzerini tahlil qiluvchi vosita
import { UAParser } from "ua-parser-js";
// Express so'rov obyekti tipi
import type { Request } from "express";

// Autentifikatsiya biznes mantig'ini bajaruvchi servis klassi
export class AuthService {
  // Foydalanuvchi tizimga kirishi (Login) uchun xizmat ko'rsatuvchi metod
  async loginService(data: ILogin, request: Request) {
    // users.json faylidan matnni o'qib, uni JavaScript massiviga aylantiramiz
    const database: Array<IUser> = JSON.parse(
      (await readFileAsync("users.json")) as string,
    );
    // Kiritilgan telefon raqami bo'yicha bazadan mos foydalanuvchini qidiramiz
    const user = database.find(
      (user) => user.phone_number === data.phone_number,
    );
    // Agar bunday telefon raqamli foydalanuvchi topilmasa
    if (!user) {
      // 401 kodi bilan xatolik xabarini otamiz
      throw {
        message: "Bunday user mavjud emas!",
        code: 401,
      };
    }
    // Kiritilgan ochiq parol bilan bazadagi shifrlangan parolni solishtiramiz
    const comparePassword = await bcrypt.compare(data.password, user.password);
    // Agar parollar mos tushmasa
    if (!comparePassword) {
      // Telefon yoki parol noto'g'ri degan 401 xatoligini chiqaramiz
      throw {
        message: "phone_number and password do not match!",
        code: 401,
      };
    }
    // Foydalanuvchiga qisqa muddatli Access Token yaratamiz
    const access_token = generateToken(
      { id: user.id },
      process.env.JWT_ACCESS_SECRET_KEY as string,
      process.env.JWT_ACCESS_EXPIRES as SignOptions["expiresIn"],
    );
    // Uzoq muddatli Refresh Token yaratamiz
    const refresh_token = generateToken(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET_KEY as string,
      process.env.JWT_REFRESH_EXPIRES as SignOptions["expiresIn"],
    );
    // So'rov sarlavhasidagi (headers) user-agent orqali foydalanuvchi qurilmasi ma'lumotlarini aniqlaymiz
    const device = new UAParser(request.headers["user-agent"]).getResult();
    // Qurilma ma'lumotlarini terminalda ko'rsatamiz
    console.log(device);
    // Mijozga yangi yaratilgan ikkala tokenni qaytaramiz
    return {
      access_token,
      refresh_token,
    };
  }
  // Yangi foydalanuvchini ro'yxatdan o'tkazish (Register) servisi
  async registerService(data: IRegister) {
    // Mavjud foydalanuvchilar bazasini o'qib olamiz
    const database: Array<any> = JSON.parse(
      (await readFileAsync("users.json")) as string,
    );
    // Yangi kelgan telefon raqami bazada allaqachon bormi-yo'qligini tekshiramiz
    const isExistedUser = database.find(
      (user: IUser) => user.phone_number === data.phone_number,
    );
    // Agar bunday telefon raqamli foydalanuvchi hali mavjud bo'lmasa
    if (!isExistedUser) {
      // Parolni 12 marta tuzlash (salt) orqali xavfsiz xeshga aylantiramiz
      const hashedPassword = await bcrypt.hash(data.password, 12);
      // Yangi foydalanuvchi obyektini tayyorlaymiz
      const user = {
        // Hozirgi millisekund vaqtini unikal ID sifatida beramiz
        id: Date.now(),
        // Kiritilgan barcha maydonlarni (firstname, email va h.k.) qo'shamiz
        ...data,
        // Ochiq parolni xesh qilingan parol bilan almashtiramiz
        password: hashedPassword,
      };
      // Yangi foydalanuvchini bazadagi massivga qo'shamiz
      database.push(user);
      // Yangi ro'yxatdan o'tgan foydalanuvchi uchun Access Token generatsiya qilamiz
      const accessToken = generateToken(
        { id: user.id },
        process.env.JWT_ACCESS_SECRET_KEY as string,
        process.env.JWT_ACCESS_EXPIRES as SignOptions["expiresIn"],
      );
      // Refresh Token generatsiya qilamiz
      const refreshToken = generateToken(
        { id: user.id },
        process.env.JWT_REFRESH_SECRET_KEY as string,
        process.env.JWT_REFRESH_EXPIRES as SignOptions["expiresIn"],
      );
      // Yangilangan bazani users.json fayliga chiroyli formatda saqlaymiz
      await writeFileAsync("users.json", JSON.stringify(database, null, 2));
      // Mijozga yaratilgan tokenlarni muvaffaqiyatli javob sifatida qaytaramiz
      return {
        access_token: accessToken,
        refresh_token: refreshToken,
      };
    }
    // Agar bu telefon raqam bazada allaqachon mavjud bo'lsa, 409 xatolik chiqaramiz
    throw {
      message: "Bunday user tizimda mavjud",
      code: 409,
    };
  }
  // Tizimdan chiqish (Logout) uchun tayyorlangan bo'sh servis metodi
  async logoutService() {}
}
