# PWA Selfie Check-in System

ระบบเช็คอินด้วยเซลฟี่แบบ PWA สำหรับองค์กร รองรับการทำงานแบบออฟไลน์และสามารถติดตั้งได้บนมือถือ

## 🚀 คุณสมบัติหลัก

- **PWA (Progressive Web App)**: ติดตั้งได้บนมือถือเหมือน native app
- **Selfie Check-in/out**: ถ่ายเซลฟี่เพื่อยืนยันตัวตนในการเช็คอิน/เอาท์
- **GPS Tracking**: ตรวจสอบตำแหน่งในการเช็คอิน/เอาท์
- **Offline Support**: ทำงานได้แม้ไม่มีอินเทอร์เน็ต
- **Admin Panel**: ระบบจัดการพนักงานและรายงาน
- **Responsive Design**: ออกแบบให้เหมาะกับทุกหน้าจอ

## 📱 หน้าจอหลัก

1. **Login**: หน้าล็อกอินสำหรับพนักงาน
2. **Dashboard**: แดชบอร์ดแสดงสถานะการทำงาน
3. **Check-in/Check-out**: หน้าเช็คอิน/เอาท์พร้อมถ่ายเซลฟี่
4. **History**: ประวัติการเข้างานของพนักงาน
5. **Admin**: ระบบจัดการพนักงาน (สำหรับ admin)

## 🛠 เทคโนโลยีที่ใช้

### Frontend
- Vue 3 + Vite
- Tailwind CSS
- Pinia (State Management)
- PWA with Service Worker

### Backend
- Node.js + Express
- SQLite Database
- Multer (File Upload)
- bcrypt (Password Hashing)

## 🔧 การติดตั้งและใช้งาน

### ข้อกำหนดของระบบ
- Node.js >= 16.0.0
- npm หรือ yarn

### การติดตั้ง Backend

```bash
cd backend
npm install
npm start
```

Server จะทำงานที่ `http://localhost:3000`

### การติดตั้ง Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend จะทำงานที่ `http://localhost:5173`

## 👥 บัญชีทดสอบ

### ผู้ดูแลระบบ (Admin)
- รหัสพนักงาน: `admin`
- รหัสผ่าน: `admin123`

### พนักงาน
- รหัสพนักงาน: `emp001`
- รหัสผ่าน: `123456`

## 📊 ฐานข้อมูล

### ตาราง employees
- id: รหัสอัตโนมัติ
- employee_id: รหัสพนักงาน (unique)
- name: ชื่อ-นามสกุล
- email: อีเมล
- password: รหัสผ่าน (เข้ารหัส)
- role: ตำแหน่ง (admin/employee)
- created_at: วันที่สร้าง

### ตาราง attendance
- id: รหัสอัตโนมัติ
- employee_id: รหัสพนักงาน
- check_in_time: เวลาเช็คอิน
- check_out_time: เวลาเช็คเอาท์
- check_in_photo: ไฟล์รูปเช็คอิน
- check_out_photo: ไฟล์รูปเช็คเอาท์
- check_in_location: ตำแหน่งเช็คอิน (JSON)
- check_out_location: ตำแหน่งเช็คเอาท์ (JSON)
- date: วันที่

### ตาราง sessions
- id: รหัสอัตโนมัติ
- employee_id: รหัสพนักงาน
- session_token: โทเค็นเซสชัน
- expires_at: วันหมดอายุ
- created_at: วันที่สร้าง

## 🔐 การรักษาความปลอดภัย

- Session-based authentication
- Password hashing ด้วย bcrypt
- Input validation และ sanitization
- CORS configuration
- Rate limiting
- File upload validation

## 📱 PWA Features

- **Installable**: สามารถติดตั้งได้บนอุปกรณ์
- **Offline Support**: ทำงานได้แม้ไม่มีเน็ต
- **Background Sync**: ซิงค์ข้อมูลเมื่อกลับมาออนไลน์
- **Push Notifications**: แจ้งเตือนการเช็คอิน/เอาท์
- **Responsive**: ใช้งานได้ทุกขนาดหน้าจอ

## 🎯 API Endpoints

### Authentication
- POST `/api/auth/login` - เข้าสู่ระบบ
- POST `/api/auth/logout` - ออกจากระบบ
- GET `/api/auth/verify` - ตรวจสอบ session

### Attendance
- POST `/api/attendance/checkin` - เช็คอิน
- POST `/api/attendance/checkout` - เช็คเอาท์
- GET `/api/attendance/status` - สถานะวันนี้
- GET `/api/attendance/history` - ประวัติการเข้างาน

### Admin (ต้องมีสิทธิ์ admin)
- GET `/api/admin/employees` - รายชื่อพนักงาน
- POST `/api/admin/employees` - เพิ่มพนักงาน
- PUT `/api/admin/employees/:id` - แก้ไขพนักงาน
- DELETE `/api/admin/employees/:id` - ลบพนักงาน
- GET `/api/admin/attendance` - รายงานการเข้างาน
- GET `/api/admin/stats` - สถิติระบบ

## 📸 การใช้งานกล้องและ GPS

### Camera Integration
- ใช้ `navigator.mediaDevices.getUserMedia()`
- รองรับ front camera สำหรับ selfie
- บันทึกรูปในรูปแบบ JPEG
- ตรวจสอบคุณภาพรูปภาพ

### GPS Integration
- ใช้ `navigator.geolocation.getCurrentPosition()`
- บันทึกพิกัด latitude, longitude
- ตรวจสอบความแม่นยำของตำแหน่ง
- รองรับการทำงานแบบ high accuracy

## 🔄 Development

### Build สำหรับ Production

```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm start
```

### Environment Variables

สร้างไฟล์ `.env` ใน backend directory:

```
NODE_ENV=production
PORT=3000
JWT_SECRET=your-secret-key
```

## 📝 การใช้งาน

1. เข้าสู่ระบบด้วยบัญชีทดสอบ
2. ไปที่หน้า Check-in
3. อนุญาตการใช้งานกล้องและ GPS
4. ถ่ายเซลฟี่และยืนยันตำแหน่ง
5. เช็คอินเรียบร้อย
6. ดูประวัติในหน้า History
7. Admin สามารถจัดการพนักงานในหน้า Admin

## 🎨 Customization

สามารถปรับแต่งได้ใน:
- `frontend/tailwind.config.js` - สีและธีม
- `frontend/src/assets/main.css` - CSS เพิ่มเติม
- `frontend/public/manifest.json` - PWA configuration
- `backend/src/config/` - ตั้งค่า backend

## 🔧 Troubleshooting

### ปัญหาที่พบบ่อย

1. **กล้องไม่ทำงาน**: ตรวจสอบการอนุญาตใช้งานกล้อง
2. **GPS ไม่ทำงาน**: ตรวจสอบการอนุญาตตำแหน่ง
3. **PWA ไม่ติดตั้งได้**: ตรวจสอบ HTTPS และ manifest.json
4. **Database error**: ตรวจสอบสิทธิ์ในการเขียนไฟล์

### Performance Tips

- ใช้ image compression สำหรับรูปภาพ
- Enable service worker caching
- Optimize bundle size
- Use lazy loading สำหรับ components

## 📄 License

MIT License - ใช้งานได้อย่างอิสระ

## 🤝 การสนับสนุน

หากมีปัญหาการใช้งาน สามารถสร้าง issue ได้ที่ repository นี้
