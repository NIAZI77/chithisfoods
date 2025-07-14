# ChithisFoods

A modern multi-vendor food delivery platform connecting local chefs and home cooks with food lovers. This monorepo contains both the backend (Strapi) and frontend (Next.js) applications.

---

## Table of Contents
- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Directory Structure](#directory-structure)
- [Contributing](#contributing)
- [License](#license)
- [Further Reading](#further-reading)

---

## Project Overview
ChithisFoods is a full-stack platform for food ordering and delivery, supporting three main user roles:
- **User:** Browse, order, and track food from local chefs and home cooks.
- **Vendor:** Manage dishes, orders, and payments.
- **Admin:** Oversee users, vendors, orders, payments, and platform settings.

---

## Architecture
- **Backend:** [Strapi](https://strapi.io/) (Node.js) – Handles API, authentication, content management, and business logic.
- **Frontend:** [Next.js](https://nextjs.org/) (React) – Provides a modern, responsive web interface for all user roles.

```
Root
├── backend/   # Strapi backend (API, admin, content types)
└── frontend/  # Next.js frontend (User, Vendor, Admin interfaces)
```

---

## Tech Stack
- **Backend:** Strapi, Node.js, JWT Auth
- **Frontend:** Next.js 15, React 19, Tailwind CSS, MUI, Radix UI, Lucide React, React Icons
- **State & Utilities:** React Hooks, Cookies, Toastify, Day.js, Date-fns, Swiper, Recharts
- **Authentication:** JWT, Google & Facebook OAuth
- **Database:** (See backend/config/database.js for details)

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### 1. Clone the repository
```bash
git clone <repo-url>
cd chithisfoods
```

### 2. Setup Backend
```bash
cd backend
npm install
# or
yarn install

# Development
npm run develop
# or
yarn develop
```

For more backend details, see [backend/README.md](./backend/README.md).

### 3. Setup Frontend
```bash
cd ../frontend
npm install
# or
yarn install

# Development
npm run dev
# or
yarn dev
```

For more frontend details, see [frontend/README.md](./frontend/README.md).

## Environment Variables: .env and .env.example

### Purpose
- **.env**: Stores sensitive configuration (API keys, database URLs, secrets) required for your app to run. **This file must be created and configured before running `npm run start` or any production/development server.**
- **.env.example**: A template file showing all required environment variables (without sensitive values). Share this in your repo so others know what to set in their own .env.

### Project Policy
- Both **backend** and **frontend** require a `.env` file for correct operation.
- The `.env` file is **gitignored** (not committed), but `.env.example` should be present in the repo as a reference.

#### Backend (`/backend`)
- **Required before running:** `npm run start`, `npm run develop`, or `yarn start`
- **Typical variables:** Database connection strings, JWT secrets, API keys, etc.
- **How to use:**
  1. Copy `.env.example` to `.env`
  2. Fill in the required values
  3. Start the backend

#### Frontend (`/frontend`)
- **Required before running:** `npm run start`, `npm run dev`, or `yarn start`
- **Typical variables:** API base URLs, public keys for third-party services, etc.
- **How to use:**
  1. Copy `.env.example` to `.env`
  2. Fill in the required values
  3. Start the frontend

#### Example Workflow
```bash
# For both backend and frontend
cp .env.example .env
# Edit .env and fill in your secrets and config
```

#### Important
- **Never commit your `.env` file** to version control.
- Always update `.env.example` when you add new required environment variables.

---

## Directory Structure
```
chithisfoods/
├── backend/   # Strapi backend (APIs, content types, config)
│   ├── config/
│   ├── database/
│   ├── src/
│   │   ├── api/         # APIs: admin, category, dish, order, vendor
│   │   ├── extensions/  # User permissions, etc.
│   │   └── admin/
│   └── types/
├── frontend/  # Next.js frontend (app, components, public)
│   ├── app/
│   ├── components/
│   ├── public/
│   └── lib/
└── README.md  # (this file)
```

---

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Create a new Pull Request

---

## License
This project is licensed under the MIT License.

---

## Further Reading
- [backend/README.md](./backend/README.md) – Backend setup, deployment, and Strapi docs
- [frontend/README.md](./frontend/README.md) – Frontend features, structure, and scripts

---

**For more details, see the code and comments in each directory.** 