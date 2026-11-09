# ThaoTo – AI Chinese Learning Platform

Nền tảng học tiếng Trung trực tuyến toàn diện từ HSK 1 đến HSK 9, tích hợp **AI Chinese Tutor**, thuật toán lặp lại ngắt quãng **Spaced Repetition (SRS SM-2)**, và hệ thống luyện 4 kỹ năng Nghe - Nói - Đọc - Viết.

Dự án được xây dựng với cơ sở dữ liệu **MySQL trên XAMPP (Cổng 3307)** thông qua **Prisma ORM**.

---

## 🛠 Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide Icons.
- **Backend:** Next.js Route Handlers (RESTful API), JWT Authentication, Bcrypt.
- **Database:** MySQL on XAMPP (Port 3307), Prisma ORM v5.
- **AI & Speech:** Web Speech API (nhận diện giọng nói và phát âm tiếng Trung chuẩn), RAG (Retrieval-Augmented Generation) kết nối từ điển & ngữ pháp, sẵn sàng mở rộng OpenAI.
- **Canvas:** HTML5 Canvas tương tác cho bảng Mễ tự cách luyện viết chữ Hán.

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Dự Án

### 1. Khởi động MySQL trên XAMPP
Đảm bảo dịch vụ MySQL trên XAMPP đang chạy trên cổng **3307** (`127.0.0.1:3307`).

### 2. Cấu hình biến môi trường
File `.env` đã được thiết lập sẵn:
```env
DATABASE_URL="mysql://root:@127.0.0.1:3307/hanlearn"
JWT_SECRET="hanlearn_super_secure_jwt_secret_token_key_2025_chinese_learning"
NEXT_PUBLIC_APP_NAME="HanLearn"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### 3. Đồng bộ Database & Nạp dữ liệu mẫu (Seed)
```bash
# Đẩy schema Prisma lên MySQL cổng 3307
npx prisma db push

# Nạp dữ liệu từ vựng HSK, ngữ pháp, đề thi, tình huống nói và tài khoản
npm run db:seed
```

### 4. Khởi chạy ứng dụng
```bash
npm run dev
```
Truy cập trình duyệt tại: [http://localhost:3000](http://localhost:3000)

---

## 🔑 Tài Khoản Trải Nghiệm Mẫu

| Vai trò | Email | Mật khẩu |
|---|---|---|
| **Học viên (Student)** | `demo@hanlearn.com` | `123456` |
| **Quản trị viên (Admin)** | `admin@hanlearn.com` | `admin123` |

---

## 📚 Các Phân Hệ Chức Năng Chính

1. **Dashboard:** Thống kê chuỗi ngày học liên tục (Streak), số thẻ cần ôn hôm nay (SRS), biểu đồ điểm kinh nghiệm và mục tiêu ngày.
2. **Lộ trình HSK (Roadmap):** Toàn bộ chuẩn từ HSK 1 đến HSK 9 theo định hướng CLEC và HSK 3.0.
3. **Từ điển & Từ vựng:** Tra cứu Giản thể, Phồn thể, Pinyin, nghĩa tiếng Việt, số nét, bộ thủ và ví dụ minh họa kèm audio phát âm chuẩn.
4. **Flashcards (SRS):** Bộ thẻ nhớ hai mặt tích hợp thuật toán SuperMemo 2 (Anki SM-2) với 4 nút đánh giá (Again, Hard, Good, Easy).
5. **Ngữ pháp:** Công thức cấu trúc, phân tích chi tiết, cảnh báo lỗi sai kinh điển (VD: phân biệt 的/得/地, cách dùng 了).
6. **Luyện nghe (Listening):** Hội thoại audio, tùy chỉnh tốc độ (1x, 0.75x, 0.5x), ẩn hiện phụ đề song ngữ và bài trắc nghiệm hiểu bài.
7. **Luyện nói AI (Speaking):** Nhập vai đối thoại tình huống thực tế (gọi món, sân bay, mua sắm) với phản hồi tức thì và góp ý phát âm.
8. **Luyện viết chữ Hán (Writing):** Bảng vẽ cảm ứng Mễ tự cách, theo dõi thứ tự nét bút thuận (笔顺) và 7 quy tắc viết chữ Hán.
9. **Luyện đọc (Reading):** Bài đọc phân cấp, ước lượng thời gian, tra từ vựng trực tiếp và câu hỏi đọc hiểu.
10. **Phòng thi thử HSK:** Đề thi bấm giờ tự động, chấm điểm tức thì và phân tích đáp án chi tiết.
11. **AI Chinese Tutor 24/7:** Giải đáp ngữ pháp, dịch câu, tra cứu dựa trên RAG từ cơ sở dữ liệu thật.
12. **Nguồn dữ liệu (Data Sources):** Quản lý CC-CEDICT, Chinese Grammar Wiki, theo dõi giấy phép và kích hoạt đồng bộ.
13. **Admin Dashboard:** Giám sát cơ sở dữ liệu MySQL, quản trị thành viên và thống kê toàn sàn.

