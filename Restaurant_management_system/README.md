# 🍽️ Restaurant Management System

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

A fully-featured **REST API backend** for managing restaurant operations — built with **Node.js**, **Express.js**, **MongoDB Atlas**, and **Prisma ORM**. Supports order processing, table management, reservations, inventory tracking, and sales reporting.

> 🚫 No frontend — all endpoints tested via **Postman**.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Roles & Permissions](#-roles--permissions)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database Models](#-database-models)
- [API Endpoints](#-api-endpoints)
- [Testing with Postman](#-testing-with-postman)

---

## ✨ Features

- 🔐 **JWT Authentication** with role-based access control (admin, manager, staff)
- 🍕 **Menu Management** — CRUD operations with category filtering and availability toggle
- 📦 **Order Processing** — automatic total calculation, nested order items, status lifecycle
- 🪑 **Table Management** — real-time status tracking (available, occupied, reserved)
- 📅 **Reservation System** — conflict checking to prevent double-booking
- 📊 **Inventory Management** — auto-deduction when orders are placed, low-stock flagging
- 📈 **Reporting** — daily sales breakdown, stock alerts, top-selling items

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB Atlas | Cloud database |
| Prisma ORM v6 | Database modeling & queries |
| JSON Web Tokens | Authentication |
| bcryptjs | Password hashing |
| dotenv | Environment variable management |
| cors | Cross-origin resource sharing |

---

## 👥 Roles & Permissions

| Role | Access |
|---|---|
| `admin` | Full access to everything |
| `manager` | Orders, inventory, reports, reservations |
| `staff` | Place orders, update order status |

---

## 📁 Project Structure

```
restaurant-management-system/
├── config/
│   └── prisma.js               ← Shared Prisma client instance
├── controllers/
│   ├── authController.js       ← Register & login
│   ├── menuController.js       ← Menu CRUD
│   ├── orderController.js      ← Order processing & status
│   ├── tableController.js      ← Table management & availability
│   ├── reservationController.js← Reservation booking & cancellation
│   ├── inventoryController.js  ← Stock management
│   └── reportController.js     ← Sales reports & alerts
├── routes/
│   ├── authRoutes.js
│   ├── menuRoutes.js
│   ├── orderRoutes.js
│   ├── tableRoutes.js
│   ├── reservationRoutes.js
│   ├── inventoryRoutes.js
│   └── reportRoutes.js
├── middleware/
│   └── authMiddleware.js       ← JWT protect + role authorize
├── prisma/
│   └── schema.prisma           ← Database models
├── .env
├── .gitignore
└── server.js                   ← Entry point
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone git@github.com:Ysweb3/CodeAlpha_tasks.git
cd restaurant-management-system
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory (see [Environment Variables](#-environment-variables) below).

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Start the development server

```bash
npm run dev
```

Server runs on `http://localhost:3000`

---

## 🔑 Environment Variables

Create a `.env` file in the root with the following:

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/restaurant_db?retryWrites=true&w=majority` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `mysupersecretkey123` |
| `PORT` | Port to run the server on | `3000` |

```env
DATABASE_URL="mongodb+srv://yourUsername:yourPassword@cluster0.xxxxx.mongodb.net/restaurant_db?retryWrites=true&w=majority"
JWT_SECRET=mysupersecretkey123
PORT=3000
```

> ⚠️ Never commit your `.env` file — it's already in `.gitignore`

---

## 🗄️ Database Models

| Model | Key Fields |
|---|---|
| `User` | id, name, email, password, role, createdAt |
| `MenuItem` | id, name, description, price, category, available, createdAt |
| `Order` | id, tableId, staffId, status, totalAmount, createdAt, updatedAt |
| `OrderItem` | id, orderId, menuItemId, quantity, price (snapshot) |
| `Table` | id, number, capacity, status |
| `Reservation` | id, userId, tableId, guestCount, date, status, createdAt |
| `Inventory` | id, name, quantity, unit, alertLevel, updatedAt |

---

## 📡 API Endpoints

### 🔐 Auth

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a new user with a role |
| POST | `/api/auth/login` | Public | Login and receive a JWT token |

### 🍕 Menu

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/menu` | Public | Get all available menu items (filter by `?category=`) |
| GET | `/api/menu/:id` | Public | Get a single menu item by ID |
| POST | `/api/menu` | Admin, Manager | Create a new menu item |
| PUT | `/api/menu/:id` | Admin, Manager | Update a menu item or toggle availability |
| DELETE | `/api/menu/:id` | Admin | Delete a menu item |

### 📦 Orders

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/orders` | Staff+ | Place a new order with items array |
| GET | `/api/orders` | Manager+ | Get all orders (filter by `?status=`) |
| GET | `/api/orders/:id` | Staff+ | Get a single order with full details |
| PATCH | `/api/orders/:id/status` | Staff+ | Update order status (pending → preparing → served) |
| PATCH | `/api/orders/:id/cancel` | Staff+ | Cancel a pending order |

### 🪑 Tables

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/tables` | Staff+ | Get all tables with current status |
| GET | `/api/tables/available` | Public | Get available tables (filter by `?guestCount=` and `?date=`) |
| POST | `/api/tables` | Admin | Add a new table |
| PUT | `/api/tables/:id/status` | Staff+ | Manually update table status |

### 📅 Reservations

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/reservations` | Authenticated | Make a reservation (conflict check included) |
| GET | `/api/reservations` | Manager+ | Get all reservations (filter by `?status=`) |
| PATCH | `/api/reservations/:id/cancel` | Staff+ | Cancel a reservation |

### 📦 Inventory

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/inventory` | Manager+ | Get all inventory items (low-stock items flagged) |
| POST | `/api/inventory` | Admin | Add a new inventory item |
| PUT | `/api/inventory/:id` | Manager+ | Restock or update an inventory item |
| DELETE | `/api/inventory/:id` | Admin | Remove an inventory item |

### 📈 Reports

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/reports/daily-sales` | Manager+ | Total revenue & orders for a date (`?date=YYYY-MM-DD`) |
| GET | `/api/reports/stock-alerts` | Manager+ | All inventory items below their alert level |
| GET | `/api/reports/top-items` | Manager+ | Top 5 best-selling menu items by quantity |

---

## 🧪 Testing with Postman

Test in the following order to cover the full flow:

### Step 1 — Register & Login

```json
POST /api/auth/register
{
  "name": "Admin User",
  "email": "admin@restaurant.com",
  "password": "123456",
  "role": "admin"
}
```

```json
POST /api/auth/login
{
  "email": "admin@restaurant.com",
  "password": "123456"
}
```

> Copy the `token` from the login response and add it to all protected requests:
> **Header:** `Authorization: Bearer <token>`

---

### Step 2 — Create a Table

```json
POST /api/tables
{
  "number": 1,
  "capacity": 4
}
```

---

### Step 3 — Create a Menu Item

```json
POST /api/menu
{
  "name": "Margherita Pizza",
  "description": "Classic cheese pizza",
  "price": 250,
  "category": "main"
}
```

---

### Step 4 — View Menu (Public)

```
GET /api/menu
GET /api/menu?category=main
```

---

### Step 5 — Place an Order

```json
POST /api/orders
{
  "tableId": "<table_id>",
  "items": [
    { "menuItemId": "<menu_item_id>", "quantity": 2 }
  ]
}
```

> Table status will automatically change to `"occupied"`

---

### Step 6 — Update Order Status

```json
PATCH /api/orders/<order_id>/status
{ "status": "preparing" }

PATCH /api/orders/<order_id>/status
{ "status": "served" }
```

> Setting status to `"served"` automatically frees the table back to `"available"`

---

### Step 7 — Make a Reservation

```json
POST /api/reservations
{
  "tableId": "<table_id>",
  "guestCount": 2,
  "date": "2026-08-15T19:00:00Z"
}
```

---

### Step 8 — Add Inventory & Test Auto-Deduct

```json
POST /api/inventory
{
  "name": "Margherita Pizza",
  "quantity": 50,
  "unit": "pieces",
  "alertLevel": 10
}
```

> Place another order for Margherita Pizza, then check `GET /api/inventory` — quantity should have decreased automatically

---

### Step 9 — Reports

```
GET /api/reports/daily-sales
GET /api/reports/daily-sales?date=2026-06-20
GET /api/reports/stock-alerts
GET /api/reports/top-items
```

---

## 📝 Notes

- All timestamps are in **ISO 8601 UTC** format
- Inventory auto-deduction works by **matching the menu item name** to an inventory item name exactly
- For `daily-sales` and `top-items` reports, orders must have `status: "served"` to be counted
- JWT tokens expire after **7 days**

---

## 👨‍💻 Author

Built as part of a backend development internship project.
