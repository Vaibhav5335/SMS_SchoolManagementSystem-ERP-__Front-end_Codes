# 🏫 School Management System (ERP) – Frontend UI

The **School Management System (ERP) – Frontend** is a comprehensive, multi-role user interface designed to simulate real-world school operations through a structured and scalable frontend architecture.

This project brings together multiple user roles into a single cohesive system, enabling seamless interaction across administrative and academic workflows. Built entirely using **HTML, CSS, and Vanilla JavaScript**, it reflects how enterprise-grade ERP dashboards function in modern educational environments.

From managing schools at a platform level to tracking student performance and communication, this system delivers a **complete UI simulation of a real-world educational ERP ecosystem**.

---

<p align="center">
  <strong>🏫 School ERP Frontend System</strong><br/>
  <em>Multi-Role Dashboard Interface for Modern Education Systems</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-Frontend-orange?style=flat-square&logo=html5"/>
  <img src="https://img.shields.io/badge/CSS3-Styling-blue?style=flat-square&logo=css3"/>
  <img src="https://img.shields.io/badge/JavaScript-Vanilla-yellow?style=flat-square&logo=javascript"/>
  <img src="https://img.shields.io/badge/Architecture-Modular-green?style=flat-square"/>
  <img src="https://img.shields.io/badge/License-MIT-lightgrey?style=flat-square"/>
</p>

---

## 📋 Table of Contents

* [Overview](#-overview)
* [Key Features](#-key-features)
* [Role-Based Modules](#-role-based-modules)
* [Project Structure](#-project-structure)
* [Core Architecture](#-core-architecture)
* [JavaScript Modules](#-javascript-modules)
* [UI Features](#-ui-features)
* [Application Flow](#-application-flow)
* [Tech Stack](#-tech-stack)
* [Getting Started](#-getting-started)
* [Use Cases](#-use-cases)

---

## 🌟 Overview

The system is designed to replicate a **multi-role ERP platform**, where different users interact with tailored dashboards and functionalities.

Each role operates within its own dedicated interface while sharing a unified structure, enabling:

* 🎯 Role-based navigation
* 📊 Data visualization through dashboards
* 🧩 Modular frontend design
* 🔐 Simulated authentication system

### 👥 Supported Roles

* 👑 Super Admin
* 🏫 School Admin
* 👩‍🏫 Teacher
* 👨‍👩‍👧 Parent / Student

---

## ✨ Key Features

| Feature             | Description                              |
| ------------------- | ---------------------------------------- |
| 🔐 Multi-Role Login | Separate login interfaces for each role  |
| 📊 Dashboard System | Role-specific dashboards with data views |
| 🧩 Modular UI       | Structured code with reusable components |
| ⚙️ JS Modules       | Organized logic via separate JS files    |
| 📁 Role Separation  | Independent UI folders for each role     |

---

## 👥 Role-Based Modules

### 👑 Super Admin Panel

The top-level control system managing the entire platform.

**Capabilities:**

* Manage schools
* Configure platform settings
* Monitor system-wide activity

📄 Pages:

* Dashboard
* School Management
* Platform Settings
* Login

---

### 🏫 School Admin Panel

Handles internal school operations and administration.

**Capabilities:**

* Academic configuration
* User (student/teacher) management
* Analytics monitoring

📄 Pages:

* Dashboard
* Academic Config
* User Management
* Analytics
* Profile

---

### 👩‍🏫 Teacher Panel

Focused on classroom-level management and academic interaction.

**Capabilities:**

* Attendance tracking
* Homework assignment
* Marks entry
* Communication

📄 Pages:

* Dashboard
* Attendance
* Homework
* Marks
* Communication
* Profile

---

### 👨‍👩‍👧 Parent / Student Panel

Provides visibility into academic progress and communication.

**Capabilities:**

* Attendance monitoring
* Academic tracking
* Exam results
* Financial overview
* Communication

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

```id="realstruct2"
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

### 🔁 Role-Based UI Flow

```id="roleflow2"
User Login → Role Detection → Dashboard Redirect → Role-Specific Access
```

Each role is fully isolated with:

* Dedicated folder structure
* Independent UI screens
* Separate navigation flows

---

## ⚙️ JavaScript Modules

### 📌 `auth-guard.js`

* Handles authentication logic
* Restricts unauthorized access
* Ensures role-based navigation

---

### 📌 `data-service.js`

* Simulates backend data
* Provides dynamic data to UI

---

### 📌 `common-features.js`

* Shared utilities
* UI interaction handling
* Reusable logic

---

### 📌 `error-handler.js`

* Manages runtime errors
* Improves system stability

---

## 🎨 UI Features

* 📊 Dashboard-driven layouts
* 📁 Sidebar navigation per role
* 📋 Data tables for records
* 🧾 Forms for input handling
* 🎯 Clean and structured design

---

## 🔄 Application Flow

```id="realflow2"
1. User opens Landing Page
2. Selects role (Admin / Teacher / Student)
3. Logs in via role-specific login page
4. Redirected to dashboard
5. Navigates modules
6. Interacts with system features
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

## ⚡ Getting Started

### ▶️ Run Locally

1. Extract the ZIP
2. Open:

```id="runfile2"
LandingPage.html
```

3. Explore different roles and dashboards

---

## 🔑 Credentials

Credentials are available in:

```id="cred2"
Credentials Little Change.txt
```

---

## 📊 Use Cases

* 🏫 Educational ERP prototype
* 🎓 Academic demonstration project
* 💼 Frontend portfolio showcase
* 🧩 Role-based system design

---

## 🌟 Highlights

✔ Multi-role ERP dashboard system
✔ Clean modular frontend architecture
✔ Real-world UI simulation
✔ Scalable structure
✔ Fully built using Vanilla JavaScript

---

## 🧩 Future Enhancements

* ⚛️ Convert to React/Vue
* 🌐 Integrate backend APIs
* 🔐 Implement real authentication (JWT)
* 📊 Add analytics dashboard
* 📱 Make responsive design

---

## 👨‍💻 Author

**Vaibhav Sharma**

* Frontend Developer
* Focused on building scalable UI systems

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 💡 Final Note

This project goes beyond a simple UI — it represents a **complete frontend ERP simulation**, showcasing how complex systems manage **multiple roles, workflows, and interactions** in a structured and scalable way.

---
