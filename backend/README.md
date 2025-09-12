# 🍽️ ChithisFoods Backend (Strapi)

This is the backend API for the ChithisFoods platform, built with [Strapi](https://strapi.io/). It powers the multi-vendor food delivery system, handling authentication, content management, business logic, and API endpoints for users, vendors, and admins.

**Live Demo:** [chithisfoods.vercel.app](https://chithisfoods.vercel.app)  
**Repository:** [https://github.com/NIAZI77/chithisfoods](https://github.com/NIAZI77/chithisfoods)  
**Last Updated:** December 2024

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
- **Framework:** Strapi v5.12.4 (Node.js 20.17.0)
- **Purpose:** Provides RESTful APIs and admin panel for ChithisFoods frontend
- **Roles:** User, Vendor, Admin
- **Authentication:** JWT, Social login (via frontend)
- **Database:** PostgreSQL (pg v8.14.1) / SQLite (better-sqlite3 v11.3.0)
- **File Upload:** Cloudinary provider for media management
- **Email:** Nodemailer provider for email notifications
- **Admin Panel:** Built-in Strapi admin interface

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
- Node.js (v20.17.0 recommended)
- npm (v10.8.2 recommended) or yarn
- PostgreSQL (for production) or SQLite (for development)

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

**Admin Panel:** Access at [http://localhost:1337/admin](http://localhost:1337/admin)

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

### Recommended Platforms
- **AWS:** EC2 instances with RDS PostgreSQL, S3 for file storage, CloudFront for CDN
- **DigitalOcean:** Droplets with managed PostgreSQL database
- **Strapi Cloud:** Easiest deployment option with managed infrastructure
- **Railway:** Simple Node.js deployment with PostgreSQL
- **Heroku:** Traditional PaaS option (deprecated for free tier)

### AWS Deployment
- **EC2:** Use t3.medium or larger instances
- **RDS:** PostgreSQL database for production
- **S3:** File storage for uploads
- **CloudFront:** CDN for static assets
- **Load Balancer:** For high availability

### DigitalOcean Deployment
- **Droplets:** Use 2GB RAM minimum (4GB recommended)
- **Managed Database:** PostgreSQL cluster
- **Spaces:** Object storage for file uploads
- **Load Balancer:** For scaling

### Environment Variables for Production
Ensure all required environment variables are set in your production environment:
- Database connection strings (PostgreSQL recommended)
- JWT secrets (strong, unique keys)
- Admin panel credentials
- CORS settings (allow frontend domain)
- Cloudinary credentials (for file uploads)
- Nodemailer SMTP settings (for email notifications)

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

## API Documentation
- **Base URL:** `http://localhost:1337/api` (development)
- **Admin Panel:** `http://localhost:1337/admin`
- **Content Types:** Check `src/api/*/content-types/` for data models
- **Endpoints:** See `src/api/*/routes/` for available routes

## Troubleshooting
- **Database connection:** Check your database configuration in `config/database.js`
- **CORS issues:** Update CORS settings in `config/middlewares.js`
- **Admin panel not loading:** Run `npm run build` and restart the server
- **API not responding:** Check server logs and ensure all required environment variables are set
- **File upload issues:** Verify Cloudinary credentials and configuration
- **Email not sending:** Check Nodemailer SMTP settings and credentials
- **Memory issues:** Ensure adequate RAM (2GB+ for production)
- **Node.js version:** Ensure using Node.js 20.17.0 for compatibility

---

**For API details, see the code and comments in each module.**
