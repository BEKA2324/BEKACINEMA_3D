// Fayl manzillarini operatsion tizimga mos ravishda to'g'ri ulash uchun Node.js kutubxonasi
import path from "path";
// Fayllarni asinxron (Promise asosida) o'qish va yozish uchun fs moduli
import { readFile, writeFile } from "fs/promises";

// Loyiha ishga tushirilgan joriy asosiy papka manzilini olamiz
const rootDir = process.cwd();

// data papkasidagi JSON fayllarni asinxron o'qib beruvchi yordamchi funksiya
export const readFileAsync = async (
  // O'qilishi kerak bo'lgan fayl nomi (masalan: "users.json")
  fileName: string,
): Promise<string | null> => {
  try {
    // Ildiz papka + src + data + fayl_nomi orqali to'liq fayl yo'lini hosil qilamiz
    const filePath = path.join(rootDir, "src", "data", fileName);
    // Ko'rsatilgan faylni UTF-8 matn formatida asinxron o'qiymiz
    const data = await readFile(filePath, "utf-8");
    // O'qilgan matnni qaytaramiz
    return data;
  } catch (error) {
    // Fayl topilmasa yoki o'qishda xatolik yuz bersa, konsolga xabarni chiqaramiz
    console.error("Faylni o'qishda xatolik:", error);
    // Xatolik holatida null qaytaramiz
    return null;
  }
};

// data papkasidagi faylga ma'lumotni asinxron yozib beruvchi yordamchi funksiya
export const writeFileAsync = async (
  // Ma'lumot yozilishi kerak bo'lgan fayl nomi
  fileName: string,
  // Fayl ichiga yoziladigan matn (odatda JSON ko'rinishida)
  data: string,
): Promise<boolean> => {
  try {
    // Faylning to'liq manzilini tuzamiz
    const filePath = path.join(rootDir, "src", "data", fileName);
    // Ma'lumotni faylga to'liq yozib qo'yamiz (mavjud bo'lsa yangilaydi)
    await writeFile(filePath, data, "utf-8");
    // Jarayon muvaffaqiyatli yakunlansa, true qaytaramiz
    return true;
  } catch (error) {
    // Agar faylga yozish jarayonida xatolik chiqsa, uni konsolga chiqaramiz
    console.error("Faylga yozishda xatolik:", error);
    // Xatolik bo'lsa false qaytaramiz
    return false;
  }
};
