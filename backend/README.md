# 🍽️ ChithisFoods Backend (Strapi)

This is the backend API for the ChithisFoods platform, built with [Strapi](https://strapi.io/). It powers the multi-vendor food delivery system, handling authentication, content management, business logic, and API endpoints for users, vendors, and admins.

---

## Table of Contents
- [Overview](#overview)
- [Features & API Modules](#features--api-modules)
- [API Endpoints & Structure](#api-endpoints--structure)
- [How to Add a New API Module](#how-to-add-a-new-api-module)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Deployment](#deployment)
- [Cron Jobs & Scheduled Tasks](#cron-jobs--scheduled-tasks)
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

## API Endpoints & Structure

APIs are organized under `src/api/`:
- **admin/**: Platform management (users, vendors, orders, payments, settings)
- **category/**: Food categories CRUD
- **dish/**: Dishes/products CRUD
- **order/**: Order placement, tracking, management
- **vendor/**: Vendor registration, verification, management

Each module contains:
- `content-types/`: Data models (schema.json)
- `controllers/`: Business logic for endpoints
- `routes/`: API route definitions
- `services/`: Reusable service logic

User permissions and roles are managed in `src/extensions/users-permissions/`.

---

## How to Add a New API Module

1. Duplicate an existing module in `src/api/` (e.g., `category/`).
2. Update `content-types/schema.json` for your new data model.
3. Implement controller logic in `controllers/`.
4. Define routes in `routes/`.
5. Add business logic in `services/` if needed.
6. Register permissions if required in `extensions/users-permissions/`.
7. Restart the backend server.

---

## Cron Jobs & Scheduled Tasks

- **Weekly Stats Reset:**
  - Every Monday at midnight (server time), a cron job resets all vendors' `weeklyItemsSold` and all dishes' `weeklySalesCount` to 0.
  - This powers the weekly "Top Chefs" and "Popular Dishes" features on the frontend.
  - The cron job is configured in [`config/server.js`](./config/server.js) under the `cron.tasks` section.
  - To modify or disable, edit the schedule or logic in that file.
  - **Example:**
    ```js
    // backend/config/server.js
    module.exports = ({ env }) => ({
      // ...
      cron: {
        enabled: true,
        tasks: {
          '0 0 * * 1': async () => {
            // Reset logic here
          },
        },
      },
    });
    ```
  - **Troubleshooting:** If stats are not updating, ensure the backend server is running and cron is enabled.

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

## Environment Variables: .env and .env.example

- **.env**: Stores sensitive configuration (database URLs, JWT secrets, etc.) required for the backend to run. **You must create and configure this file before running `npm run start` or `npm run develop`.**
- **.env.example**: A template file listing all required environment variables (without secrets). Use this as a reference for your own .env.

### How to use
1. Copy `.env.example` to `.env`
2. Fill in the required values
3. Start the backend

```bash
cp .env.example .env
# Edit .env and fill in your secrets and config
```

- **Never commit your `.env` file** to version control.
- Always update `.env.example` when you add new required environment variables.

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
