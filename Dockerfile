# --- المرحلة الأولى: بناء الواجهة (Frontend Build) ---
FROM node:20-alpine as build-stage
WORKDIR /app
# نسخ ملفات تعريف المكتبات
COPY package*.json ./
# تثبيت مكتبات الرياكت
RUN npm install
# نسخ باقي ملفات المشروع
COPY . .
# بناء المشروع (سينتج مجلد اسمه dist)
RUN npm run build

# --- المرحلة الثانية: إعداد السيرفر (Backend Setup) ---
FROM python:3.9-slim

WORKDIR /app

# نسخ ملفات متطلبات البايثون وتثبيتها
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# نسخ كود البايثون
COPY backend/ .

# نسخ ملفات الواجهة الجاهزة (من المرحلة الأولى) إلى مجلد داخل البايثون
COPY --from=build-stage /app/dist /app/static

# فتح المنفذ 8000
EXPOSE 8000

# تشغيل السيرفر
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]