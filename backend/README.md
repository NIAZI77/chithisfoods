# 🍽️ ChithisFoods Backend (Strapi)

This is the backend API for the ChithisFoods platform, built with [Strapi](https://strapi.io/). It powers the multi-vendor food delivery system, handling authentication, content management, business logic, and API endpoints for users, vendors, and admins.

---

## Table of Contents
- [Overview](#overview)
- [Features & API Modules](#features--api-modules)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Deployment](#deployment)
- [Further Reading](#further-reading)

---

## Overview
- **Framework:** Strapi (Node.js)
- **Purpose:** Provides RESTful APIs and admin panel for ChithisFoods frontend
- **Roles:** User, Vendor, Admin
- **Authentication:** JWT, Social login (via frontend)

---

## Features & API Modules
- **Admin:** Platform management, user/vendor/order/payment oversight
- **Category:** Food categories management
- **Dish:** Dishes/products CRUD
- **Order:** Order placement, tracking, and management
- **Vendor:** Vendor registration, verification, and management
- **User Permissions:** Role-based access control (RBAC)

APIs are organized under `src/api/` and user permissions under `src/extensions/users-permissions/`.

---

## Project Structure
```
backend/
├── config/         # Strapi config (database, server, plugins, etc.)
├── database/       # Migrations (if any)
├── public/         # Static assets/uploads
├── src/
│   ├── admin/      # Admin panel config
│   ├── api/        # API modules: admin, category, dish, order, vendor
│   └── extensions/ # User permissions, etc.
├── types/          # TypeScript type definitions
├── package.json
└── README.md       # (this file)
```

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation & Development
```bash
cd backend
npm install
# or
yarn install

# Start in development mode (with autoReload)
npm run develop
# or
yarn develop
```

### Build Admin Panel
```bash
npm run build
# or
yarn build
```

### Start in Production
```bash
npm run start
# or
yarn start
```

---

## Deployment
Strapi supports many deployment options, including [Strapi Cloud](https://cloud.strapi.io). See [Strapi deployment docs](https://docs.strapi.io/dev-docs/deployment) for details.

---

## Further Reading
- [Main Project README](../README.md) – Full-stack setup, architecture, and usage
- [Frontend README](../frontend/README.md) – Next.js frontend details
- [Strapi Documentation](https://docs.strapi.io)

---

## Community & Resources
- [Strapi Resource Center](https://strapi.io/resource-center)
- [Strapi Tutorials](https://strapi.io/tutorials)
- [Strapi Blog](https://strapi.io/blog)
- [Strapi Discord](https://discord.strapi.io)
- [Strapi Forum](https://forum.strapi.io/)

---

**For API details, see the code and comments in each module.**
