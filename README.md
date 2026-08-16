# 🎓 Online Examination System (MERN Stack)

A full-stack, role-based online examination portal built with Node.js, Express, React, and MongoDB. The system provides dedicated workflows and access control for **Administrators**, **Examiners**, and **Students**.

---

## 🚀 Features

### 👑 Admin
* **User Management:** View all registered users (students, examiners, and admins) in a centralized dashboard.
* **Role Management:** Change user roles dynamically (`student`, `examiner`, `admin`).
* **Account Moderation:** Delete users from the system.

### 📝 Examiner
* **Exam Creation:** Create and publish exams with customizable titles, descriptions, and time limits (in minutes).
* **Question Bank Management:** Add multiple-choice questions (MCQs) with options, specify correct answer keys, and assign marks per question.
* **Exam Management:** View and manage created/published exams.

### 🎓 Student
* **Browse Available Exams:** Explore all active tests and their durations.
* **Interactive Test Interface:** Take exams with a live countdown timer and single-selection MCQ format.
* **Auto-Grading & Results:** Automatic score calculation upon submission with instant percentage and performance reports.
* **Submission History:** View previous attempts, total scores, and submission dates.

---

## 🛠️ Tech Stack

* **Frontend:** React 18 (Vite), React Router DOM, Tailwind CSS, Axios
* **Backend:** Node.js, Express.js
* **Database:** MongoDB & Mongoose
* **Authentication:** JSON Web Tokens (JWT) & bcrypt.js password hashing

---

## 📁 Project Structure

```text
online-exam-system/
├── server/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js       # Authentication logic
│   │   ├── adminController.js      # User management logic
│   │   ├── examController.js       # Exam CRUD & sanitation
│   │   └── submissionController.js # Auto-grading & submissions
│   ├── middleware/
│   │   └── authMiddleware.js       # JWT & Role authorization
│   ├── models/
│   │   ├── User.js                 # User schema (roles, bcrypt)
│   │   ├── Exam.js                 # Exam & Question schemas
│   │   └── Submission.js           # Student answer & score schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── examRoutes.js
│   │   └── submissionRoutes.js
│   ├── .env
│   ├── package.json
│   └── server.js
└── client/
    ├── src/
    │   ├── api/
    │   │   └── axiosInstance.js    # Axios with JWT interceptor
    │   ├── context/
    │   │   └── AuthContext.jsx     # Global authentication state
    │   ├── components/
    │   │   ├── ProtectedRoute.jsx  # Role-based route guard
    │   │   └── Navbar.jsx          # Dynamic navigation bar
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── AdminDashboard.jsx
    │   │   ├── ExaminerDashboard.jsx
    │   │   ├── StudentDashboard.jsx
    │   │   └── TakeExam.jsx
    │   ├── App.jsx                 # App routes
    │   ├── index.css               # Tailwind directives
    │   └── main.jsx
    ├── index.html
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── vite.config.js
    └── package.json
