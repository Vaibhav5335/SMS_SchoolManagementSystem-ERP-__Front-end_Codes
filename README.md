# SMS_SchoolManagementSystem-ERP-__Front-end_Codes

# 🏫 School Management System (ERP)

### Full-Stack Educational ERP System for Managing School Operations

---

## 📌 Overview

The **School Management System (SMS ERP)** is a comprehensive full-stack web application designed to manage and automate **school operations digitally**.

This project provides a centralized system for:

* 👨‍🎓 Student management
* 👩‍🏫 Teacher administration
* 📚 Academic records
* 💰 Fee management
* 📊 School analytics

Built from scratch, this system demonstrates real-world **ERP (Enterprise Resource Planning)** concepts applied to the education domain.

---

## 🎯 Objectives

* Digitize school administration processes
* Reduce manual work and errors
* Provide centralized data management
* Enable efficient communication between stakeholders

---

## 🚀 Key Features

### 👨‍🎓 Student Management

* Add, update, delete student records
* Track student details (class, section, etc.)
* Maintain academic history

---

### 👩‍🏫 Teacher Management

* Manage teacher profiles
* Assign subjects and classes
* Track responsibilities

---

### 📚 Academic Management

* Class & subject allocation
* Timetable management *(if implemented)*
* Record student performance

---

### 💰 Fee Management

* Track fee payments
* Maintain fee records
* Generate payment history

---

### 📊 Dashboard & Reports

* Overview of school data
* Student & teacher statistics
* Activity monitoring

---

### 🔐 Authentication System

* Secure login/logout
* Role-based access (Admin, Staff, etc.)
* Session handling

---

## 🏗️ Project Architecture

```id="smsarch"
SMS_SchoolManagementSystem/
│
├── core/ / app modules        # Business logic
│   ├── models.py              # Database schema
│   ├── views.py               # Application logic
│   ├── urls.py                # Routing
│
├── templates/                 # Frontend UI
├── static/                    # CSS, JS, assets
│
├── db.sqlite3                 # Database
├── manage.py                  # Entry point
```

---

## 🖥️ Tech Stack

### 🌐 Frontend

* HTML5
* CSS3
* Bootstrap *(if used)*

---

### ⚙️ Backend

* Python
* Django Framework

---

### 🗄️ Database

* SQLite (default) / MySQL (optional)

---

### 🧰 Tools

* VS Code
* Git & GitHub
* Browser (Chrome)

---

## 🔄 Application Workflow

```id="smsflow"
1. Admin logs into system
2. Adds students and teachers
3. Assigns classes and subjects
4. Manages fees and records
5. Users access and update data
6. System maintains centralized database
```

---

## 📂 Core Components Explained

### 📌 `models.py`

Defines:

* Student model
* Teacher model
* Fee model
* Academic records

---

### 📌 `views.py`

Handles:

* CRUD operations
* Authentication
* Data processing

---

### 📌 `urls.py`

* Routes requests to appropriate views
* Controls navigation

---

### 📌 `templates/`

* User interface pages
* Forms and dashboards

---

## 🎨 UI Features

* Clean and structured layout
* Dashboard-based navigation
* Forms for data entry
* Tables for displaying records
* User-friendly experience

---

## 🔐 Security Features

* User authentication system
* Password protection
* Session management
* Role-based access control

---

## 📊 Database Design

### 👨‍🎓 Student Table

* ID
* Name
* Class
* Section

---

### 👩‍🏫 Teacher Table

* ID
* Name
* Subject

---

### 💰 Fee Table

* Payment status
* Amount
* Date

---

### 📚 Academic Table

* Marks
* Subjects
* Performance

---

## ⚡ Installation & Setup

### 1️⃣ Clone Repository

```bash id="smsclone"
git clone https://github.com/Vaibhav5335/SMS_SchoolManagementSystem-ERP-__Front-end_Codes.git
cd school-management-system
```

---

### 2️⃣ Create Virtual Environment

```bash id="smsvenv"
python -m venv venv
source venv/bin/activate   # Linux/Mac
venv\Scripts\activate      # Windows
```

---

### 3️⃣ Install Dependencies

```bash id="smsinstall"
pip install -r requirements.txt
```

---

### 4️⃣ Run Migrations

```bash id="smsmigrate"
python manage.py migrate
```

---

### 5️⃣ Run Server

```bash id="smsrun"
python manage.py runserver
```

---

### 6️⃣ Open in Browser

```id="smsopen"
http://127.0.0.1:8000/
```

---

## 📊 Use Cases

* 🏫 Schools & Colleges
* 📊 Educational institutions
* 💼 ERP learning projects
* 🎓 Student portfolio

---

## 🌟 Highlights

✔ Complete ERP system
✔ Full-stack development
✔ Real-world use case
✔ Modular architecture
✔ Built from scratch

---

## 🧩 Future Enhancements

* 📱 Mobile responsive UI
* 📊 Advanced analytics dashboard
* 📧 Email/SMS notifications
* 🌐 Cloud deployment
* 🧠 AI-based performance analysis

---

## 👨‍💻 Author

**Vaibhav Sharma**

* Full Stack Developer
* Passionate about building scalable systems

---

## 📜 License

This project is licensed under the **MIT License**.

---

---
