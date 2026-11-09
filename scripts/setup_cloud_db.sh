#!/usr/bin/env bash
set -e

# Setup Cloud Database for ThaoTo (TiDB / Aiven / Railway / Any Cloud MySQL)
# Usage: ./scripts/setup_cloud_db.sh "mysql://<user>:<password>@<host>:<port>/<dbname>?sslaccept=strict"

TARGET_URL="${1:-$DATABASE_URL}"

if [ -z "$TARGET_URL" ] || [[ "$TARGET_URL" == *"127.0.0.1"* ]] || [[ "$TARGET_URL" == *"localhost"* ]]; then
  echo "❌ Vui lòng cung cấp chuỗi kết nối MySQL Cloud hợp lệ."
  echo "Ví dụ: ./scripts/setup_cloud_db.sh \"mysql://user:password@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test?sslaccept=strict\""
  exit 1
fi

echo "🚀 Bắt đầu thiết lập cơ sở dữ liệu trên Cloud..."
echo "🔗 Kết nối tới: ${TARGET_URL%%:*}://***@${TARGET_URL#*@}"

# 1. Push schema (31 tables)
echo ""
echo "1️⃣ Đang khởi tạo 31 bảng dữ liệu chuẩn hóa trên Cloud (Prisma db push)..."
DATABASE_URL="$TARGET_URL" npx prisma db push --skip-generate

# 2. Seed master data
echo ""
echo "2️⃣ Đang nạp dữ liệu từ vựng, ngữ pháp và tài khoản học viên (seed_master.js)..."
DATABASE_URL="$TARGET_URL" node prisma/seed_master.js

# 3. Seed authentic official HSK 1-9 exams
echo ""
echo "3️⃣ Đang nạp ngân hàng đề thi chuẩn quốc tế HSK 1 - HSK 9 (seed_real_official_exams.js)..."
DATABASE_URL="$TARGET_URL" node prisma/seed_real_official_exams.js

echo ""
echo "🎉 HOÀN THÀNH 100%! Cơ sở dữ liệu Cloud của bạn đã sẵn sàng cho Vercel."
echo "👉 Hãy thêm biến môi trường DATABASE_URL này vào dự án Vercel của bạn và bấm Deploy!"
