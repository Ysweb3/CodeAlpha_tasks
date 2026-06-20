# ⚡ URL_Shortener

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Railway](https://img.shields.io/badge/Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)

> A fast, minimal URL shortener with analytics. Paste a long URL, get a short one. Track clicks in real time.

🔗 **Live Demo:** [ulr-shortener.onrender.com](https://ulr-shortener.onrender.com)

---

## ✨ Features

- 🔗 Shorten any valid URL instantly
- 🔁 Redirects to original URL via short code
- 📊 Analytics dashboard — track clicks, creation date & timestamp
- 🚫 Duplicate URL detection — same URL always returns the same short code
- ✅ URL validation before saving
- 🎨 Clean dark UI with interactive canvas background

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB Atlas |
| ORM | Prisma |
| Short Code Generation | nanoid |
| Templating | EJS |
| Hosting | Railway |

---

## 📁 Project Structure

```
LinkKinetic/
├── public/
│   ├── styles.css
│   ├── app.js
│   └── images/
├── routes/
│   └── shorten.js
├── views/
│   ├── index.ejs
│   └── analytics.ejs
├── prisma/
│   └── schema.prisma
├── server.js
└── .env
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account

### Installation

```bash
# Clone the repo
git clone https://github.com/CodeAlpha_tasks.git
cd linkkinetic

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate
```

### Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="mongodb+srv://user:password@cluster.mongodb.net/urlshortener?appName=urlShortener"
PORT=3000
```

### Run Locally

```bash
nodemon server.js
```

App will be running at `http://localhost:3000`

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/shorten` | Create a short URL |
| `GET` | `/:code` | Redirect to original URL |
| `GET` | `/analytics/:code` | Get analytics for a short URL |

### POST `/shorten`

**Request Body:**
```json
{
  "longUrl": "https://example.com/very/long/url"
}
```

**Response:**
```json
{
  "id": "abc123",
  "longUrl": "https://example.com/very/long/url",
  "shortCode": "q1eQqY",
  "createdAt": "2026-03-20T08:46:00.527Z",
  "clicks": 0
}
```

### GET `/analytics/:code`

**Response:**
```json
{
  "shortCode": "q1eQqY",
  "longUrl": "https://example.com",
  "clicks": 42,
  "createdAt": "2026-03-20T08:46:00.527Z"
}
```

---

## 🗄️ Database Schema

```prisma
model Url {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  longUrl   String   @unique
  shortCode String   @unique
  createdAt DateTime @default(now())
  clicks    Int      @default(0)
}
```

---

## 📄 License

## 👨‍💻 Author

Built as part of a backend development internship project.

