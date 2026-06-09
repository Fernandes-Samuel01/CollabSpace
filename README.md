# 🚀 CollabSpace - Real-Time Collaborative Document Platform

A full-stack real-time collaboration platform built with the MERN Stack and Socket.io that enables multiple users to create, share, edit, and manage documents simultaneously with role-based permissions, live synchronization, presence tracking, and activity monitoring.

---

## 🌐 Live Demo

### Frontend

https://collab-space-mocha.vercel.app

### Backend API

https://collabspace-backend-vi6w.onrender.com

---

## 📖 Overview

CollabSpace is a modern collaborative document management platform designed to provide seamless teamwork and real-time communication. Users can create documents, invite collaborators, manage permissions, and edit content together instantly.

The application combines secure authentication, real-time synchronization, role-based access control, and collaborative productivity features to deliver a smooth user experience.

---

## ✨ Features

### 🔐 Authentication & Security

* User Registration
* User Login
* JWT Authentication
* Email Verification
* Protected Routes
* Password Hashing with bcrypt
* Secure API Access

### 📄 Document Management

* Create Documents
* Edit Documents
* Delete Documents
* View Owned Documents
* View Shared Documents
* Real-Time Content Updates

### 🤝 Collaboration System

* Share Documents via Email
* Add Collaborators
* Remove Collaborators
* Role-Based Access Control
* Owner Permissions
* Editor Permissions
* Viewer Permissions
* Update Collaborator Roles

### ⚡ Real-Time Features

* Socket.io Integration
* Live Document Synchronization
* Instant Multi-User Editing
* Presence Tracking
* Typing Indicators
* User Join Notifications
* User Leave Notifications
* Connection Status Monitoring

### 📊 Productivity Features

* Activity Feed
* Save Status Indicators
* Online Presence Bar
* Shared Workspace Experience

---

## 👥 User Roles

### Owner

* Create Documents
* Edit Documents
* Delete Documents
* Share Documents
* Add Collaborators
* Remove Collaborators
* Change User Permissions

### Editor

* View Documents
* Edit Documents
* Participate in Real-Time Collaboration

### Viewer

* View Documents
* Read-Only Access

---

## 🏗️ System Architecture

```text
Frontend (React + Vite)
        │
        │ REST APIs + Socket.io
        ▼
Backend (Node.js + Express)
        │
        ▼
MongoDB Atlas
```

### Real-Time Flow

```text
User A edits document
        │
        ▼
Socket.io Event
        │
        ▼
Backend Socket Server
        │
        ▼
Broadcast Update
        │
        ▼
User B receives update instantly
```

---

## 🛠️ Technology Stack

### Frontend

* React.js
* Vite
* React Router DOM
* Context API
* Axios
* Tailwind CSS
* Socket.io Client

### Backend

* Node.js
* Express.js
* Socket.io
* JWT Authentication
* bcryptjs
* Nodemailer
* Helmet
* Cookie Parser
* CORS

### Database

* MongoDB Atlas
* Mongoose ODM

### Deployment

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas

---

## 📂 Project Structure

```text
CollabSpace
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── hooks
│   │   ├── services
│   │   ├── context
│   │   └── api
│   │
│   └── public
│
├── backend
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── middlewares
│   │   ├── models
│   │   ├── routes
│   │   ├── services
│   │   ├── sockets
│   │   └── utils
│   │
│   └── server.js
│
└── README.md
```

---

## 🚀 Local Setup

### Clone Repository

```bash
git clone https://github.com/Fernandes-Samuel01/CollabSpace
```

### Install Backend Dependencies

```bash
cd backend
npm install
```

### Install Frontend Dependencies

```bash
cd frontend
npm install
```

### Configure Environment Variables

Backend `.env`

```env
PORT=5000
NODE_ENV=development

CLIENT_URL=http://localhost:5173

MONGO_URI=your_mongodb_uri

JWT_SECRET=your_secret
JWT_EXPIRES_IN=7d

SMTP_HOST=your_smtp_host
SMTP_PORT=2525
SMTP_USER=your_user
SMTP_PASS=your_password
SMTP_FROM=your_sender
```

Frontend `.env`

```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
```

### Start Backend

```bash
npm run dev
```

### Start Frontend

```bash
npm run dev
```

---

## 📸 Core Functionalities Demonstrated

* Secure Authentication System
* Email Verification Workflow
* Real-Time Collaborative Editing
* Presence Detection
* Typing Indicators
* Role-Based Authorization
* Live Activity Tracking
* Production Deployment
* Socket-Based Communication
* RESTful API Design

---

## 🎯 Learning Outcomes

This project demonstrates practical implementation of:

* Full Stack MERN Development
* REST API Design
* Real-Time Systems Engineering
* WebSocket Communication
* Authentication & Authorization
* MongoDB Data Modeling
* Role-Based Access Control
* React State Management
* Frontend–Backend Integration
* Cloud Deployment
* Production Environment Configuration

---

## 👨‍💻 Author

### Samuel Sanjeev Fernandes

Final Year Computer Science Engineering Student

Full Stack MERN Developer

GitHub: https://github.com/Fernandes-Samuel01

---

## 📄 License

This project is developed for educational, learning, portfolio, and demonstration purposes.
