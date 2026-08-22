# GymSuite — Complete Multi-Tenant Gym Operating System

> **Product URL:** `gymsuite.acharyaworks.in`  
> **Ecosystem:** AcharyaWorks  
> **Tech Stack:** Django REST Framework + React (Vite) + Tailwind CSS + JWT + SQLite/PostgreSQL  

---

## 🏛️ Overview

**GymSuite** is a production-ready, multi-tenant Gym Management SaaS platform designed to streamline gym operations for independent fitness centers, studios, and fitness chains (50 to 500+ active members).

### Core Features

- **Multi-Tenant Data Isolation**: Complete tenant data segregation per gym.
- **Unified Public Login**: Single login endpoint (`/login`) with role tabs for Owners/Staff and Members.
- **SaaS Marketing Engine**: Complete public website featuring landing, features, pricing, about, contact, privacy, and terms pages.
- **Owner & Staff Dashboard**: Real-time business analytics, member lifecycle management, plan subscriptions, QR/Manual attendance, payment collections, expenses, and automated expiry notifications.
- **Trainer Portal**: Workout plan design, client rosters, and daily assignment tracking.
- **Member Portal**: Mobile-first portal with digital member ID card, check-in history, active membership status, and assigned workouts.
- **30-Day Free Trial & SaaS Tiering**: Integrated trial provisioning and SaaS subscription management.

---

## 🎨 UI Aesthetic & Design System

GymSuite enforces a warm, classy, light luxury aesthetic:
- **Background**: `#F7F3ED` (Cream / Off-white)
- **Surface**: `#FFFFFF` (Pure White)
- **Primary**: `#3B302A` (Espresso Brown)
- **Secondary**: `#6B5143` (Warm Brown)
- **Accent**: `#B08D57` (Muted Brass / Gold)
- **Text**: `#292522` (Charcoal)
- **Border**: `#E6DED4` (Sand)
- **Headings**: `DM Serif Display`
- **Body & UI**: `Manrope`

---

## 📁 Repository Structure

```text
GMS/
├── backend/
│   ├── apps/
│   │   ├── accounts/         # Custom User model, JWT authentication, roles
│   │   ├── gyms/             # Gym tenant model & settings
│   │   ├── members/          # Member profiles & records
│   │   ├── memberships/      # Gym plans & member subscriptions
│   │   ├── attendance/       # Manual & QR check-in engine
│   │   ├── payments/         # Fee collections, pending dues & receipts
│   │   ├── trainers/         # Trainer profiles & client assignments
│   │   ├── workouts/         # Workout routines & exercise items
│   │   ├── expenses/         # Gym operational expense logs
│   │   ├── notifications/    # Expiry & system notification center
│   │   ├── reports/          # Financial & membership aggregate analytics
│   │   └── subscriptions/    # SaaS subscription tiers & trial tracking
│   ├── config/               # Django settings, URLs, WSGI/ASGI
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI & layout elements
│   │   ├── context/          # Auth & system state providers
│   │   ├── layouts/          # Public, Owner, Trainer & Member layouts
│   │   ├── pages/            # Public, Auth, Owner, Trainer & Member views
│   │   └── services/         # Axios API HTTP modules
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── .gitignore
└── README.md
```

---

## 🚀 Quick Setup & Installation

### 1. Backend Setup (Django)

```bash
cd backend
python -m venv server
# Windows:
server\Scripts\activate
# Linux/macOS:
source server/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

The Django API server will run at `http://127.0.0.1:8000/api/v1/`.

### 2. Frontend Setup (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server will run at `http://localhost:5173/`.

---

## 🔒 Security & Multi-Tenancy Architecture

All queries in backend views automatically scope records against `request.user.gym`. Data leakages across different gyms are prevented at the viewset database filter level.
