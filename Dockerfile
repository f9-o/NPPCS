# Stage 1: Build React
FROM node:20-slim as build-stage

WORKDIR /app
COPY package*.json ./

RUN npm config set fetch-retries 5 \
    && npm config set fetch-retry-mintimeout 20000 \
    && npm config set fetch-retry-maxtimeout 120000 \
    && npm install --legacy-peer-deps

COPY . .
RUN npm run build

# Stage 2: Setup Python
FROM python:3.9-slim
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt --default-timeout=100
COPY backend/ .
COPY --from=build-stage /app/dist /app/static
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]