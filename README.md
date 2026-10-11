# ✍️ DevVerse - Full-Stack Blog Platform with Comments

A modern, full-stack blogging platform built with React, Node.js, Express, and Prisma ORM. Features user authentication, rich blog authoring with live preview, interactive commenting, likes/reactions, and database persistence.

---

## 🚀 Key Features

### 1. User Authentication & Author Profiles
- **Secure Authentication**: JSON Web Tokens (JWT) with `bcryptjs` password hashing.
- **Author Identity**: Custom author bio, avatar, and publication timestamps.
- **1-Click Evaluator Demo Logins**: Pre-configured instant login buttons in the modal for testing author permissions without typing.

### 2. Full Blog Post Management (CRUD)
- **Create Stories**: Publish articles with title, category, tags, custom excerpt, and cover image.
- **Live Preview Mode**: Toggle between "Write" and "Live Preview" before publishing.
- **Edit & Delete Permissions**: Authors can edit or delete their own published stories; readers can view and comment.
- **Reading Time & Views**: Automatic reading time calculation (words / 200 wpm) and view counter.

### 3. Comment Section for User Interaction
- **Real-Time Discussion**: Add comments to any post with author attribution and timestamp.
- **Comment Deletion Control**: Comment authors, article authors, and administrators can remove comments.
- **Like / React on Posts**: Interactive clap/like counters on articles.

### 4. Backend RESTful APIs & Database Integration
- **Relational Persistence**: Standardized with Prisma ORM.
- **Default Database**: Zero-configuration local SQLite (`dev.db`), pre-seeded with articles, authors, and comments.
- **Multi-Database Support**: Easy toggle to PostgreSQL or MySQL by modifying `schema.prisma`.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide React, React Router v6 |
| **Backend** | Node.js, Express.js, JWT, bcryptjs, CORS |
| **Database & ORM** | Prisma ORM, SQLite (`dev.db`), PostgreSQL/MySQL compatible |

---

## ⚡ Quick Start Guide

### 1. Run the Backend Server
```bash
cd server
npm start
```
*Running on `http://localhost:5001`.*

### 2. Run the Frontend Client
```bash
cd client
npm run dev
```
*Running on `http://localhost:3001`.*

---

## 🔑 Demo Credentials

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Author 1** | `alex@blog.com` | `Author@123` | Create, Edit, Delete Own Posts, Comment |
| **Author 2** | `sarah@blog.com` | `Author@123` | Create, Edit, Delete Own Posts, Comment |
| **Reader** | `david@blog.com` | `Reader@123` | Browse, Like Posts, Post Comments |

---

## 📡 RESTful API Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Create a new user/author account
- `POST /api/auth/login` - Authenticate and return JWT token
- `GET /api/auth/me` - Fetch authenticated user profile

### Blog Posts (`/api/posts`)
- `GET /api/posts` - List posts with search, category filtering, and sorting
- `GET /api/posts/:id` - Fetch single post with author, comments, and like status
- `GET /api/posts/my-posts` - Fetch logged-in author's stories
- `POST /api/posts` - Create a new blog post *(Authenticated)*
- `PUT /api/posts/:id` - Update an existing post *(Author or Admin)*
- `DELETE /api/posts/:id` - Remove a blog post *(Author or Admin)*
- `POST /api/posts/:id/like` - Toggle like/reaction on post

### Comments (`/api/comments`)
- `POST /api/comments` - Submit a comment under a blog post *(Authenticated)*
- `DELETE /api/comments/:id` - Delete a comment *(Comment author, post author, or Admin)*
- `POST /api/comments/:id/like` - Like a comment

---

## 🔄 Switching to PostgreSQL or MySQL

1. In `server/prisma/schema.prisma`, update the datasource:
   ```prisma
   datasource db {
     provider = "postgresql" // or "mysql"
     url      = env("DATABASE_URL")
   }
   ```
2. Update `DATABASE_URL` in `server/.env`.
3. Push schema and seed:
   ```bash
   npx prisma db push
   node src/seed.js
   ```
