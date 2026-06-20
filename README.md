# 🚀 CodeAlpha Internship Projects

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

A collection of **3 backend projects** built during my CodeAlpha internship. Each project is a fully functional REST API (or full-stack app) built with **Node.js**, **Express.js**, **MongoDB Atlas**, and **Prisma ORM**.

---

## 📂 Projects

| # | Project | Description | Stack |
|---|---|---|---|
| 1 | [⚡ URL Shortener](#-url-shortener) | Shorten URLs and track clicks with analytics | Express, MongoDB, Prisma, EJS, nanoid |
| 2 | [📅 Event Registration System](#-event-registration-system) | Backend API for managing events and user registrations | Express, MongoDB, Prisma, JWT |
| 3 | [🍽️ Restaurant Management System](#️-restaurant-management-system) | Full restaurant operations backend with orders, tables, inventory and reporting | Express, MongoDB, Prisma, JWT |

---

## ⚡URL Shortener

> A fast, minimal URL shortener with a real-time analytics dashboard.

🔗 **Live Demo:** [ulr-shortener.onrender.com](https://ulr-shortener.onrender.com)
📁 **Folder:** [`Simple_URL_Shortener/`](./Simple_URL_Shortener)

### Features
- 🔗 Shorten any valid URL instantly
- 🔁 Redirect to original URL via short code
- 📊 Analytics dashboard — track clicks, creation date & timestamp
- 🚫 Duplicate URL detection — same URL always returns the same short code
- ✅ URL validation before saving
- 🎨 Clean dark UI with interactive canvas background

### Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB Atlas |
| ORM | Prisma |
| Short Code Generation | nanoid |
| Templating | EJS |
| Hosting | Railway |

### API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/shorten` | Create a short URL |
| `GET` | `/:code` | Redirect to original URL |
| `GET` | `/analytics/:code` | Get analytics for a short URL |

### Quick Start

```bash
cd Simple_URL_Shortener
npm install
npx prisma generate
```

Create a `.env` file:
```env
DATABASE_URL="mongodb+srv://user:password@cluster.mongodb.net/urlshortener"
PORT=3000
```

```bash
nodemon server.js
```

---

## 📅 Event Registration System

> A REST API backend for managing events and user registrations with role-based access control.

📁 **Folder:** [`Event_registration_system/`](./Event_registration_system)

### Features
- 🔐 JWT authentication with role-based access (admin / user)
- 📋 Admins can create, update, and delete events
- 🗓️ Users can browse upcoming events and register
- 🚫 Capacity check — prevents registration when event is full
- ❌ Users can view and cancel their registrations
- 🛡️ Protected routes using auth middleware

### Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB Atlas |
| ORM | Prisma |
| Auth | JWT + bcryptjs |

### Roles & Permissions

| Role | Access |
|---|---|
| `admin` | Create, update, delete events |
| `user` | Browse events, register, cancel registration |

### API Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new user |
| `POST` | `/api/auth/login` | Public | Login and get JWT token |
| `GET` | `/api/events` | Public | Get all upcoming events |
| `GET` | `/api/events/:id` | Public | Get event details + spots left |
| `POST` | `/api/events` | Admin | Create a new event |
| `PUT` | `/api/events/:id` | Admin | Update an event |
| `DELETE` | `/api/events/:id` | Admin | Delete an event |
| `POST` | `/api/registrations/:eventId` | User | Register for an event |
| `GET` | `/api/registrations/my` | User | View my registrations |
| `PATCH` | `/api/registrations/:id/cancel` | User | Cancel a registration |

### Quick Start

```bash
cd Event_registration_system
npm install
npx prisma generate
```

Create a `.env` file:
```env
DATABASE_URL="mongodb+srv://user:password@cluster.mongodb.net/event_db?retryWrites=true&w=majority"
JWT_SECRET=your_jwt_secret
PORT=3000
```

```bash
npm run dev
```

---

## 🍽️ Restaurant Management System

> A comprehensive REST API backend for managing all restaurant operations — orders, tables, reservations, inventory, and reporting.

📁 **Folder:** [`Restaurant_management_system/`](./Restaurant_management_system)

### Features
- 🔐 JWT authentication with 3-tier role access (admin / manager / staff)
- 🍕 Menu management with category filtering and availability toggle
- 📦 Order processing with automatic total calculation and status lifecycle
- 🪑 Table management with real-time status tracking (available / occupied / reserved)
- 📅 Reservation system with conflict checking to prevent double-booking
- 📊 Inventory management with auto-deduction when orders are placed
- 📈 Reporting — daily sales breakdown, stock alerts, top-selling items

### Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB Atlas |
| ORM | Prisma |
| Auth | JWT + bcryptjs |

### Roles & Permissions

| Role | Access |
|---|---|
| `admin` | Full access to everything |
| `manager` | Orders, inventory, reports, reservations |
| `staff` | Place orders, update order status |

### API Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a user with a role |
| `POST` | `/api/auth/login` | Public | Login and get JWT token |
| `GET` | `/api/menu` | Public | Get all available menu items |
| `POST` | `/api/menu` | Admin/Manager | Create a menu item |
| `PUT` | `/api/menu/:id` | Admin/Manager | Update a menu item |
| `DELETE` | `/api/menu/:id` | Admin | Delete a menu item |
| `POST` | `/api/orders` | Staff+ | Place a new order |
| `GET` | `/api/orders` | Manager+ | Get all orders |
| `PATCH` | `/api/orders/:id/status` | Staff+ | Update order status |
| `PATCH` | `/api/orders/:id/cancel` | Staff+ | Cancel a pending order |
| `GET` | `/api/tables` | Staff+ | Get all tables |
| `GET` | `/api/tables/available` | Public | Check available tables |
| `POST` | `/api/tables` | Admin | Add a new table |
| `POST` | `/api/reservations` | Authenticated | Make a reservation |
| `GET` | `/api/reservations` | Manager+ | Get all reservations |
| `PATCH` | `/api/reservations/:id/cancel` | Staff+ | Cancel a reservation |
| `GET` | `/api/inventory` | Manager+ | Get inventory (flags low stock) |
| `POST` | `/api/inventory` | Admin | Add an inventory item |
| `PUT` | `/api/inventory/:id` | Manager+ | Restock an inventory item |
| `GET` | `/api/reports/daily-sales` | Manager+ | Daily revenue & order breakdown |
| `GET` | `/api/reports/stock-alerts` | Manager+ | Items below alert level |
| `GET` | `/api/reports/top-items` | Manager+ | Top 5 best-selling menu items |

### Quick Start

```bash
cd Restaurant_management_system
npm install
npx prisma generate
```

Create a `.env` file:
```env
DATABASE_URL="mongodb+srv://user:password@cluster.mongodb.net/restaurant_db?retryWrites=true&w=majority"
JWT_SECRET=your_jwt_secret
PORT=3000
```

```bash
npm run dev
```

---

## 🔑 Authentication (Projects 2 & 3)

All protected routes require a JWT token in the request header:

```
Authorization: Bearer <your_token>
```

Get your token by calling `POST /api/auth/login` with your email and password.

---

## 🧪 Testing

All API endpoints are tested using **Postman**. Projects 2 and 3 have no frontend — they are pure REST APIs.

---

## 📝 Common Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens (Projects 2 & 3) |
| `PORT` | Port to run the server on |

> ⚠️ Never commit `.env` files — they are included in `.gitignore` in every project

---


[![GitHub](https://img.shields.io/badge/GitHub-Ysweb3-181717?style=for-the-badge&logo=github)](https://github.com/Ysweb3)
