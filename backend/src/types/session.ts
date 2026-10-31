// Foydalanuvchining faol seansi (kirgan qurilmasi va tokenni nazorat qilish) strukturasi
export interface ISessionUser {
  // Seansning takrorlanmas unikal identifikatori
  id: string | number;
  // Seans qaysi foydalanuvchiga tegishli ekanligini ko'rsatuvchi ID
  user_id: number | string;
  // Foydalanuvchi foydalanayotgan qurilma nomi (masalan: Chrome on Windows)
  device_name: string;
  // Qurilma turi: Mobil telefon, Kompyuter, Planshet yoki boshqa matn
  device_type: "Mobile" | "Desktop" | "Tablet" | string;
  // Brauzer va operatsion tizim haqidagi to'liq ma'lumot (User-Agent header)
  "user-agent": string;
  // Xavfsizlik uchun Refresh tokenni xeshlab saqlash maydoni
  refresh_hash: string;
  // Foydalanuvchi so'rov yuborgan IP manzili
  ip_address: string;
  // Seans bekor qilinganmi (chiqib ketilganmi) yoki faolmi
  is_revoked: boolean;
  // Seans qachongacha amal qilishi (muddati tugash sanasi)
  expires_at: string;
  // Seans qachon boshlangan sana va vaqti
  created_at: string;
}
