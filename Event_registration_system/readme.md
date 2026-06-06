# 🎟️ Event Registration System

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

> A robust, secure, and scalable RESTful backend API for managing events and user registrations — built with Node.js, Express, MongoDB Atlas, and Prisma ORM.

---

## 📖 Description

The **Event Registration System** is a full-featured backend API that enables organisations to manage events and handle user registrations seamlessly. It supports two roles — **Admin** and **User** — with clearly defined permissions. Admins can create and manage events, while users can browse, register for, and cancel their event registrations. All routes are protected using **JWT-based authentication** and **role-based access control (RBAC)**.

The API is designed to be tested and consumed via **Postman** or any HTTP client.

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure login and registration with token-based auth
- 👥 **Role-Based Access Control** — Separate permissions for `admin` and `user` roles
- 📅 **Event Management** — Admins can create, update, and delete events
- 🔎 **Event Discovery** — Users can browse all upcoming events and view details
- ✅ **Event Registration** — Users can register for available events
- 🚫 **Capacity Enforcement** — Prevents over-registration when an event is full
- ❌ **Registration Cancellation** — Users can cancel their own registrations
- 🛡️ **Protected Routes** — Middleware-enforced authentication and authorisation
- 🔑 **Password Security** — Passwords hashed with `bcryptjs`

---

## 🗂️ Folder Structure

```
event-registration-system/
├── prisma/
│   └── schema.prisma          # Prisma schema and data models
├── src/
│   ├── controllers/
│   │   ├── auth.controller.js       # Register & login logic
│   │   ├── event.controller.js      # Event CRUD logic
│   │   └── registration.controller.js # Registration logic
│   ├── middlewares/
│   │   ├── auth.middleware.js       # JWT verification
│   │   └── role.middleware.js       # Role-based access guard
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── event.routes.js
│   │   └── registration.routes.js
│   ├── utils/
│   │   └── prismaClient.js          # Prisma client singleton
│   └── app.js                       # Express app setup
├── .env                             # Environment variables (git-ignored)
├── .env.example                     # Sample env file
├── .gitignore
├── package.json
└── server.js                        # Entry point
```

---

## ⚙️ Tech Stack

| Layer            | Technology              |
|------------------|-------------------------|
| Runtime          | Node.js                 |
| Framework        | Express.js              |
| Database         | MongoDB Atlas (Cloud)   |
| ORM              | Prisma                  |
| Authentication   | JSON Web Tokens (JWT)   |
| Password Hashing | bcryptjs                |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/)
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account and cluster

---

### 🛠️ Installation & Setup

**1. Clone the repository**

```bash
git clone git@github.com:Ysweb3/CodeAlpha_tasks.git
cd event-registration-system
```

**2. Install dependencies**

```bash
npm install
```

**3. Create your `.env` file**

```bash
cp .env.example .env
```

Then open `.env` and fill in your values (see table below).

**4. Generate the Prisma client**

```bash
npx prisma generate
```

**5. Push schema to MongoDB Atlas** *(first-time setup)*

```bash
npx prisma db push
```

**6. Start the development server**

```bash
npm run dev
```

The server will be running at `http://localhost:PORT`.

---

## 🔑 Environment Variables

Create a `.env` file in the project root with the following variables:

| Variable       | Description                                              | Example                          |
|----------------|----------------------------------------------------------|----------------------------------|
| `DATABASE_URL` | MongoDB Atlas connection string (used by Prisma)         | `mongodb+srv://user:pass@...`    |
| `JWT_SECRET`   | Secret key used to sign and verify JWT tokens            | `myS3cr3tK3y!`                   |
| `PORT`         | Port on which the Express server runs                    | `5000`                           |

> ⚠️ **Never commit your `.env` file.** It is listed in `.gitignore` by default.

---

## 📡 API Endpoints

All endpoints are prefixed with `/api`. For protected routes, include the JWT token in the request header:

```
Authorization: Bearer <your_token>
```

---

### 🔐 Auth Routes

| Method | Endpoint               | Access  | Description                              |
|--------|------------------------|---------|------------------------------------------|
| POST   | `/api/auth/register`   | Public  | Register a new user account              |
| POST   | `/api/auth/login`      | Public  | Login and receive a JWT token            |

---

### 📅 Event Routes

| Method | Endpoint            | Access     | Description                              |
|--------|---------------------|------------|------------------------------------------|
| GET    | `/api/events`       | Public     | Get a list of all upcoming events        |
| GET    | `/api/events/:id`   | Public     | Get details of a specific event by ID   |
| POST   | `/api/events`       | Admin only | Create a new event                       |
| PUT    | `/api/events/:id`   | Admin only | Update an existing event by ID           |
| DELETE | `/api/events/:id`   | Admin only | Delete an event by ID                    |

---

### 📋 Registration Routes

| Method | Endpoint                          | Access     | Description                                      |
|--------|-----------------------------------|------------|--------------------------------------------------|
| POST   | `/api/registrations/:eventId`     | User       | Register the logged-in user for an event         |
| GET    | `/api/registrations/my`           | User       | View all registrations for the logged-in user    |
| PATCH  | `/api/registrations/:id/cancel`   | User       | Cancel a specific registration by ID             |

---

## 🧪 Testing with Postman

This API is built to be tested with **[Postman](https://www.postman.com/)**. Follow the steps below to get started quickly.

### Step 1 — Register a User

- **Method:** `POST`
- **URL:** `http://localhost:5000/api/auth/register`
- **Body** → `raw` → `JSON`:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "securepassword123",
  "role": "user"
}
```

> Use `"role": "admin"` to create an admin account.

---

### Step 2 — Login and Copy the Token

- **Method:** `POST`
- **URL:** `http://localhost:5000/api/auth/login`
- **Body** → `raw` → `JSON`:

```json
{
  "email": "jane@example.com",
  "password": "securepassword123"
}
```

Copy the `token` from the response.

---

### Step 3 — Set the Authorization Header

For all protected routes, go to the **Headers** tab in Postman and add:

| Key             | Value                  |
|-----------------|------------------------|
| `Authorization` | `Bearer <your_token>`  |
| `Content-Type`  | `application/json`     |

> 💡 **Tip:** Use Postman's **Environments** feature to save your token as a variable (e.g., `{{token}}`) so you don't have to paste it manually every time.

---

### Step 4 — Create an Event (Admin)

- **Method:** `POST`
- **URL:** `http://localhost:5000/api/events`
- **Body** → `raw` → `JSON`:

```json
{
  "title": "Tech Summit 2025",
  "description": "A premier tech conference for developers.",
  "date": "2025-09-15T09:00:00.000Z",
  "location": "New Delhi, India",
  "capacity": 200
}
```

---

### Step 5 — Register for an Event (User)

- **Method:** `POST`
- **URL:** `http://localhost:5000/api/registrations/:eventId`

Replace `:eventId` with an actual event ID from the `GET /api/events` response.

---

### Step 6 — View Your Registrations

- **Method:** `GET`
- **URL:** `http://localhost:5000/api/registrations/my`

---

### Step 7 — Cancel a Registration

- **Method:** `PATCH`
- **URL:** `http://localhost:5000/api/registrations/:id/cancel`

Replace `:id` with the registration ID returned from your registrations list.

---




---

> Built with ❤️ using Node.js, Express, MongoDB Atlas, and Prisma.
