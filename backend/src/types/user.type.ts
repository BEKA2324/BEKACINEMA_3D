// Bazada saqlanadigan foydalanuvchi ma'lumotlari strukturasi (interfeysi)
export interface IUser {
  // Foydalanuvchining takrorlanmas unikal ID raqami
  id: number;
  // Foydalanuvchining ismi
  firstname: string;
  // Foydalanuvchining familiyasi
  lastname: string;
  // Foydalanuvchining yoshi
  age: number;
  // Foydalanuvchining telefon raqami (identifikatsiya uchun)
  phone_number: string;
  // Shifrlangan (xesh qilingan) maxfiy parol
  password: string;
}
