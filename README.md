#  PrimeTrade API

A scalable REST API with JWT Authentication & Role-Based Access Control, built with Node.js, Express, PostgreSQL, and Prisma ORM.

---

##  Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Runtime     | Node.js                           |
| Framework   | Express.js                        |
| Database    | PostgreSQL + Prisma ORM           |
| Auth        | JWT + bcryptjs                    |
| Validation  | Zod                               |
| Docs        | Swagger UI (OpenAPI 3.0)          |
| Security    | Helmet, CORS, Rate Limiting       |
| Frontend    | React.js (Vite)                   |

---

##  Project Structure

'''text
primetrade-backend/
├── src/
│   ├── config/         # DB & Swagger config
│   ├── controllers/    # Route handlers
│   ├── middlewares/    # Auth, validation, error handling
│   ├── routes/v1/      # Versioned API routes
│   ├── services/       # Business logic
│   ├── utils/          # JWT helpers, response formatter
│   └── app.js
├── prisma/
│   └── schema.prisma
├── frontend/           # React.js frontend
├── .env.example
├── server.js
└── README.md
'''

---

##  Setup & Installation

### Prerequisites
- Node.js v18+
- PostgreSQL installed and running

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/primetrade-backend.git
cd primetrade-backend
```

### 2. Install backend dependencies
```bash
npm install
```

### 3. Configure environment variables
```bash
cp .env.example .env
```
Edit `.env` with your values:
```env
PORT=5000
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/primetrade_db"
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### 4. Setup database
```bash
npx prisma migrate dev --name init
```

### 5. Start backend server
```bash
npm run dev
```

### 6. Install & run frontend
```bash
cd frontend
npm install
npm run dev
```

---

##  API Endpoints

### Auth
| Method | Endpoint                  | Access  | Description        |
|--------|---------------------------|---------|--------------------|
| POST   | /api/v1/auth/register     | Public  | Register new user  |
| POST   | /api/v1/auth/login        | Public  | Login & get token  |

### Tasks
| Method | Endpoint                  | Access       | Description          |
|--------|---------------------------|--------------|----------------------|
| GET    | /api/v1/tasks             | USER + ADMIN | Get tasks            |
| POST   | /api/v1/tasks             | USER + ADMIN | Create task          |
| GET    | /api/v1/tasks/:id         | USER + ADMIN | Get task by ID       |
| PUT    | /api/v1/tasks/:id         | USER + ADMIN | Update task          |
| DELETE | /api/v1/tasks/:id         | USER + ADMIN | Delete task          |

### Users
| Method | Endpoint                  | Access  | Description          |
|--------|---------------------------|---------|----------------------|
| GET    | /api/v1/users/me          | USER    | Get own profile      |
| GET    | /api/v1/users             | ADMIN   | Get all users        |

---

##  API Documentation

Swagger UI available at:
http://localhost:5000/api-docs
---

##  Security Features

- Password hashing with **bcryptjs** (salt rounds: 12)
- **JWT** token authentication (7 day expiry)
- **Role-based access control** (USER / ADMIN)
- **Helmet.js** for secure HTTP headers
- **Rate limiting** (100 req/15min general, 10 req/15min auth)
- Input validation & sanitization with **Zod**
- Global error handling with proper HTTP status codes

---

##  Scalability Note

See [SCALABILITY.md](./SCALABILITY.md)

---
