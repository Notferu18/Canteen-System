# Canteen Management System
### IT15/L — Integrative Programming Final Project

A full-stack Canteen Management System built with React.js and Laravel, designed to automate day-to-day canteen operations including menu management, order processing, inventory tracking, and sales reporting.

---

## Backend Setup (Laravel)

```bash
cd canteen-backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

---

## Frontend Setup (React)

```bash
cd canteen-frontend
npm install
cp .env.example .env
npm run dev
```

---

## Default Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@gmail.com | admin1213 |
| Cashier | cashier@gmail.com | cashier1213 |
| Customer | customer@gmail.com | customer1213 |
