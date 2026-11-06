# BlogiTech (BloggyTech)

A modern, high-performance blogging and publishing platform engineered for developers, architects, and technical leaders sharing engineering patterns and system design insights.

---

## 🌟 Features

- **Authentication & Authorization**: Secure JWT authentication, password reset with email tokens, and account verification flow.
- **Creator Dashboard**: Creator metrics (published articles, total claps, followers, profile viewers), article management, and account settings.
- **Content Creation & Publishing**: Clean, distraction-free writing experience with live preview, featured cover image upload (Cloudinary), category taxonomy, and scheduled publishing for future dates.
- **Reader Experience**: Clean typography inspired by Medium, Hashnode, Notion, and Linear. Responsive reader view with reading time estimates.
- **Community Interaction**: Interactive claps, likes, dislikes, one-click link sharing, and threaded discussion comments (add, edit, delete).
- **Social Graph**: Follow and unfollow authors, block and unblock users, and profile viewer tracking.
- **Taxonomy & Discovery**: Multi-filter article archive, category browsing, and real-time keyword search.

---

## 📁 Project Structure

```
BloggyTech/
├── backend/                      # Express.js REST API & MongoDB models
│   ├── config/                   # Database connection
│   ├── controllers/              # Route controllers (users, posts, categories, comments)
│   ├── middlewares/              # Auth & error handling middlewares
│   ├── models/                   # Mongoose data schemas
│   ├── routes/                   # API route handlers
│   ├── utils/                    # Cloudinary & Nodemailer utilities
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/                     # React.js + Vite + Tailwind CSS frontend
│   ├── src/
│   │   ├── api/                  # Centralized Axios API client modules
│   │   ├── components/           # Reusable UI primitives and domain components
│   │   ├── context/              # AuthContext and ToastContext
│   │   ├── pages/                # Public, Auth, and Dashboard views
│   │   ├── App.jsx               # Application router
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (Local Community Server on `localhost:27017` or MongoDB Atlas cloud connection)

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` (refer to `.env.example`):
```env
PORT=3000
MONGO_URL=mongodb://localhost:27017/bloggytech
JWT_KEY=your_secret_key
GMAIL_USER=your_email@gmail.com
APP_PWD=your_gmail_app_password
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the backend server:
```bash
npm run dev
# or: npm start
```
*Backend server runs on `http://localhost:3000`.*

---

### 3. Frontend Setup

In a new terminal window:
```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/` (refer to `.env.example`):
```env
VITE_API_URL=/api/v1
```

Start the Vite development server:
```bash
npm run dev
```
*Frontend runs on `http://localhost:5173` with automated proxy to `http://localhost:3000`.*

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, React Router DOM, Axios, Lucide React, Context API
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, Multer, Cloudinary, Nodemailer, Bcryptjs

---

## 📄 License
ISC

