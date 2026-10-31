// Ro'yxatdan o'tish (Register) vaqtida mijozdan qabul qilinadigan ma'lumotlar strukturasi
export interface IRegister {
  // Foydalanuvchining ismi
  firstname: string;
  // Foydalanuvchining familiyasi
  lastname: string;
  // Foydalanuvchining elektron pochta manzili
  email: string;
  // Foydalanuvchining telefon raqami
  phone_number: string;
  // Foydalanuvchining xavfsiz paroli
  password: string;
}

// Tizimga kirish (Login) vaqtida mijozdan qabul qilinadigan ma'lumotlar strukturasi
export interface ILogin {
  // Foydalanuvchining telefon raqami (login sifatida ishlatiladi)
  phone_number: string;
  // Foydalanuvchining paroli
  password: string;
}
