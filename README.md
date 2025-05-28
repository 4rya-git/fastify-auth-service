# 🛡️ Fastify Auth API

A secure and modular authentication service built with **Fastify**, **JWT**, **Valkey (Redis)**, and **MongoDB**.

---

## 📦 Features

- User registration and login
- JWT-based access and refresh tokens
- Secure password reset flow
- Token blacklist on logout using Valkey
- Profile route protected with authentication middleware
- Environment-based configuration using `@fastify/env`

---

## 📁 Folder Structure

```
src/
├── config/           # Environment, MongoDB, Redis, Auth config
├── controllers/      # Request handlers
├── models/           # Mongoose models
├── routes/           # API route definitions
├── services/         # Business logic
├── utils/            # JWT utility
├── types/            # Fastify plugin types
└── server.ts         # Main server entry point
```

---

## 🛠️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/4rya-git/fastify-auth-service.git
cd fastify-auth-service
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a `.env` file

```env
PORT=8000
MONGO_URI=mongodb://localhost:27017/npl_auth
JWT_SECRET=supersecretkey
JWT_REFRESH_SECRET=superrefreshsecret
VALKEY_SERVICE_URI=redis://localhost:6379
```

### 4. Start the server

```bash
npm run dev
```

---

## 🔐 API Endpoints

All routes are prefixed with `/api`.

---

### 🚀 Auth Routes

| Method | Endpoint              | Description             | Body / Params |
|--------|-----------------------|-------------------------|----------------|
| POST   | `/api/register`       | Register a new user     | `{ "email": "user@example.com", "password": "yourpassword" }` |
| POST   | `/api/login`          | Login and get tokens    | `{ "email": "user@example.com", "password": "yourpassword" }` |
| POST   | `/api/logout`         | Logout & blacklist token | Requires `Authorization: Bearer <access_token>` header |
| POST   | `/api/forgot-password`| Send password reset token | `{ "email": "user@example.com" }` |
| POST   | `/api/reset-password` | Reset password using token | `{ "token": "reset_token_here", "new_password": "newpassword123" }` |
| POST   | `/api/refresh-token`  | Get new access/refresh tokens | `{ "refresh_token": "your_refresh_token" }` |

---

### 👤 User Routes

| Method | Endpoint          | Description        | Auth Required |
|--------|-------------------|--------------------|----------------|
| GET    | `/api/user/profile` | Get user profile | ✅ Yes (`Authorization: Bearer <token>`) |

---

## 🧪 Example Test Data

### Register

```bash
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

### Login

```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

### Get Profile

```bash
curl -X GET http://localhost:8000/api/user/profile \
  -H "Authorization: Bearer <access_token>"
```

### Forgot Password

```bash
curl -X POST http://localhost:8000/api/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

### Reset Password

```bash
curl -X POST http://localhost:8000/api/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token": "RESET_TOKEN", "new_password": "newsecurepassword"}'
```

### Refresh Token

```bash
curl -X POST http://localhost:8000/api/refresh-token \
  -H "Content-Type: application/json" \
  -d '{"refresh_token": "REFRESH_TOKEN"}'
```

### Logout

```bash
curl -X POST http://localhost:8000/api/logout \
  -H "Authorization: Bearer <access_token>"
```

---

## 📌 Notes

- All passwords are hashed using **bcrypt** before storage.
- Refresh tokens are saved in the user model and validated before issuing new ones.
- Access tokens are short-lived (`15m`) and must be refreshed with valid refresh tokens.
- Tokens are blacklisted on logout using **Valkey (Redis)** for added security.

---

## 🧪 Tech Stack

- **Fastify** – Web framework
- **MongoDB + Mongoose** – Database
- **Redis (Valkey)** – Token blacklist
- **JWT** – Token-based authentication
- **bcrypt** – Password hashing

---