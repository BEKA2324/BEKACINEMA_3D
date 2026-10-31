// JSON Web Token (JWT) yaratish va boshqarish uchun kutubxona
import jwt from "jsonwebtoken";
// jsonwebtoken kutubxonasidan amal qilish muddatiga oid tip
import type { SignOptions } from "jsonwebtoken";

// Foydalanuvchi ma'lumotlari asosida yangi raqamli imzolangan token yaratuvchi funksiya
export const generateToken = (
  // Token ichiga joylanadigan foydali ma'lumot (masalan: { id: user.id })
  payload: any,
  // Tokenni shifrlash va imzolash uchun maxfiy kalit (secret key)
  key: string,
  // Tokenning amal qilish vaqti (masalan: "15h" yoki "7d")
  expires: SignOptions["expiresIn"],
) => {
  // jwt.sign metodi orqali yangi token shakllantiramiz
  const token = jwt.sign(payload, key, {
    // Belgilangan amal qilish muddatini sozlaymiz
    expiresIn: expires,
  });
  // Yaratilgan token matnini qaytaramiz
  return token;
};

// Kelgusida kelgan tokenni haqiqiyligini tekshirish (verifikatsiya) uchun tayyorlangan funksiya
const verifyToken = () => {};
