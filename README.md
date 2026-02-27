# 🏫 School Management System (ERP) – Frontend UI

### Multi-Role Educational ERP Interface (Super Admin | School Admin | Teacher | Parent/Student)

---

## 📌 Overview

The **School Management System (ERP) – Frontend** is a **complete multi-role UI system** designed to manage and visualize school operations across different user roles.

This project is built using **pure HTML, CSS, and JavaScript**, and simulates a real-world **ERP dashboard system** with multiple access levels:

* 👑 Super Admin
* 🏫 School Admin
* 👩‍🏫 Teacher
* 👨‍👩‍👧 Parent / Student

It demonstrates:

* 🎯 Role-based UI architecture
* 📊 Dashboard-driven design
* 🧩 Modular frontend structure
* 🔐 Authentication simulation

---

## 🚀 Key Features

### 🔐 Multi-Role Authentication System

* Separate login pages for each role
* Role-based dashboard access
* Authentication guard (`auth-guard.js`)

---

### 👑 Super Admin Panel

* Platform-level control
* School management system
* Global settings configuration

📄 Pages:

* Dashboard
* School Management
* Platform Settings
* Login

---

### 🏫 School Admin Panel

* Academic configuration
* User management
* Analytics dashboard

📄 Pages:

* Dashboard
* Academic Config
* User Management
* Analytics
* Profile

---

### 👩‍🏫 Teacher Panel

* Attendance management
* Homework assignment
* Marks entry
* Communication system

📄 Pages:

* Dashboard
* Attendance
* Homework
* Marks
* Communication
* Profile

---

### 👨‍👩‍👧 Parent / Student Panel

* Academic tracking
* Attendance monitoring
* Exam & results
* Fee/finance details
* Communication/chat

📄 Pages:

* Dashboard
* Attendance
* Academics
* Exam
* Finance
* Timetable
* Chat
* Documents

---

## 🏗️ Project Structure

```id="realstruct"
SMS_SchoolManagementSystem(ERP)/
│
├── LandingPage.html
│
├── 1 Sup_Admin-View/
├── 2 Sch_Admin-View/
├── 3 Teacher-View/
├── 4 P-S_View/
│
├── js/
│   ├── auth-guard.js
│   ├── common-features.js
│   ├── data-service.js
│   ├── error-handler.js
│
├── Credentials.png
├── Credentials Little Change.txt
```

---

## 🧠 Core Architecture

### 🔁 Role-Based UI Design

```id="roleflow"
User Login → Role Identification → Redirect to Specific Dashboard → Access Allowed Pages
```

Each role has:

* Dedicated folder
* Separate UI
* Independent navigation system

---

## ⚙️ JavaScript Modules Explained

### 📌 `auth-guard.js`

* Protects pages
* Ensures user is authenticated
* Handles role-based access

---

### 📌 `data-service.js`

* Simulates backend data handling
* Provides data to UI components

---

### 📌 `common-features.js`

* Shared functionalities across modules
* UI interactions and reusable logic

---

### 📌 `error-handler.js`

* Handles frontend errors
* Improves system stability

---

## 🎨 UI Features

* 📊 Dashboard-based layout
* 📁 Sidebar navigation (role-specific)
* 📋 Tables for data display
* 🧾 Forms for input
* 📱 Structured and clean interface

---

## 🔄 Application Flow

```id="realflow"
1. User opens Landing Page
2. Selects role (Admin / Teacher / Student)
3. Logs in via role-specific login page
4. Redirected to respective dashboard
5. Navigates through modules
6. Interacts with UI (forms, data, features)
```

---

## 🖥️ Tech Stack

### 🌐 Frontend

* HTML5
* CSS3
* JavaScript (Vanilla JS)

---

### ⚙️ Architecture

* Modular JS structure
* Role-based UI separation
* Simulated backend logic

---

## ⚡ How to Run

### ▶️ Simple Setup

1. Extract the ZIP
2. Open:

```id="runfile"
LandingPage.html
```

3. Navigate through roles and dashboards

---

## 🔑 Credentials

* Credentials are provided in:

```id="cred"
Credentials Little Change.txt
```

---

## 📊 Use Cases

* 🏫 School ERP UI prototype
* 🎓 Academic project
* 💼 Frontend portfolio project
* 🧩 Role-based system design demo

---

## 🌟 Highlights

✔ Multi-role ERP system
✔ Clean modular frontend architecture
✔ Real-world dashboard simulation
✔ Pure JavaScript implementation (no framework)
✔ Large-scale UI project

---

## 🧩 Future Enhancements

* ⚛️ Convert to React/Vue
* 🌐 Connect with real backend APIs
* 🔐 Implement real authentication (JWT)
* 📊 Add real-time analytics
* 📱 Make fully responsive

---

## 👨‍💻 Author

**Vaibhav Sharma**

* Frontend Developer
* Focused on building scalable UI systems

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 💡 Note

This project is not just a UI — it is a **complete ERP frontend simulation** demonstrating how large-scale systems handle **multiple user roles and workflows**.

---
