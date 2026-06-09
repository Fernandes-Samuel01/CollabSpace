# 🚀 CollabSpace – Real-Time Collaborative Document Platform

CollabSpace is a full-stack real-time collaboration platform that enables multiple users to create, edit, and manage documents simultaneously. Built using the MERN stack and Socket.io, the application provides secure authentication, live document synchronization, role-based access control, user presence tracking, typing indicators, and activity monitoring.

## 📌 Overview

Modern teams require seamless collaboration while working on shared content. CollabSpace addresses this need by providing a responsive, secure, and real-time environment where users can work together efficiently.

The platform supports document ownership, collaborator management, permission-based editing, live updates, and real-time communication features, making it suitable for team collaboration, project planning, note sharing, and document management.

---

## ✨ Key Features

### Authentication & Security

* User Registration and Login
* JWT-Based Authentication
* Email Verification
* Protected Routes
* Secure Password Hashing using bcrypt

### Document Management

* Create Documents
* Edit Documents
* Delete Documents
* View Owned Documents
* View Shared Documents

### Real-Time Collaboration

* Live Document Synchronization using Socket.io
* Multi-User Editing
* Instant Updates Across Connected Clients
* Automatic Reconnection Support

### Collaboration Controls

* Share Documents via Email
* Role-Based Permissions
* Editor Access
* Viewer Access
* Remove Collaborators
* Update Collaborator Roles

### Presence System

* Active User Tracking
* Real-Time Presence Bar
* User Join Notifications
* User Leave Notifications

### Productivity Features

* Typing Indicators
* Activity Feed
* Save Status Indicators
* Live Connection Status

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
* MongoDB
* Mongoose
* Socket.io
* JWT Authentication
* Nodemailer
* Cookie Parser
* Helmet
* CORS

### Database

* MongoDB Atlas

### Deployment

* Frontend: Vercel
* Backend: Render

---

## 🏗️ System Architecture

Client (React)
↓
Axios / Socket.io
↓
Express API + Socket Server
↓
MongoDB Atlas

Users interact with the React frontend, which communicates with the Express backend through REST APIs and Socket.io events. Real-time collaboration events are synchronized instantly between connected clients while document data is persisted in MongoDB.

---

## 📂 Project Structure

CollabSpace
├── frontend
│ ├── src
│ ├── components
│ ├── pages
│ ├── hooks
│ ├── context
│ └── services
│
├── backend
│ ├── src
│ ├── controllers
│ ├── services
│ ├── routes
│ ├── models
│ ├── sockets
│ ├── middlewares
│ └── config
│
└── README.md

---

## 🔐 User Roles

### Owner

* Full document access
* Share documents
* Remove collaborators
* Update collaborator permissions
* Delete documents

### Editor

* View document
* Edit document content
* Participate in real-time collaboration

### Viewer

* View document only
* Read-only access

---

## 🚀 Getting Started

### Clone Repository

git clone https://github.com/Fernandes-Samuel01/CollabSpace.git

### Install Backend Dependencies

cd backend
npm install

### Install Frontend Dependencies

cd frontend
npm install

### Run Backend

npm run dev

### Run Frontend

npm run dev

---

## 🌟 Learning Outcomes

This project demonstrates practical implementation of:

* Full Stack MERN Development
* REST API Design
* Real-Time Systems using Socket.io
* Authentication & Authorization
* Role-Based Access Control
* MongoDB Data Modeling
* React State Management
* Frontend-Backend Integration
* Production Deployment

---

## 👨‍💻 Author

Samuel sanjeev Fernandes

Final Year Computer Science Engineering Student

Full Stack MERN Developer

---

## 📄 License

This project is developed for educational, learning, and portfolio purposes.
