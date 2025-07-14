# ChithisFoods Frontend

A modern multi-vendor food delivery platform connecting local chefs and home cooks with food lovers. This is the frontend (Next.js) application for ChithisFoods, supporting three main user roles: **User**, **Vendor**, and **Admin**.

---

## Table of Contents

- [Features](#features)
  - [User](#user)
  - [Vendor](#vendor)
  - [Admin](#admin)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### User

- **Browse & Search:** Explore a variety of homemade meals, snacks, and desserts.
- **Order Food:** Add dishes to cart, checkout, and track order status.
- **Profile Management:** View and edit profile, manage order history, and update settings.
- **Authentication:** Sign up, log in, reset password, and social login (Google, Facebook).
- **FAQs & Testimonials:** Access frequently asked questions and read testimonials.
- **Responsive UI:** Seamless experience across devices.

### Vendor

- **Vendor Registration:** Apply to become a vendor with profile, business, and verification details.
- **Dashboard:** Overview of sales, orders, and performance metrics.
- **Inventory Management:** Add, edit, and manage dishes.
- **Order Management:** View, process, and update order statuses.
- **Payment Tracking:** Monitor payments and payouts.
- **Profile & Settings:** Manage vendor profile, business info, and settings.

### Admin

- **Admin Dashboard:** Overview of platform metrics, recent orders, and activity.
- **User & Vendor Management:** View, search, filter, and manage users and vendors (block, verify, ban, etc.).
- **Order Management:** Monitor and manage all platform orders.
- **Payment Management:** Oversee payment flows and tax metrics.
- **Global Settings:** Configure categories, tax percentages, and other platform-wide settings.
- **Authentication:** Secure admin login with role-based access.

---

## Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/)
- **UI:** React 19, Tailwind CSS, MUI, Radix UI, Lucide React, React Icons
- **State & Utilities:** React Hooks, Cookies, Toastify, Day.js, Date-fns, Swiper, Recharts
- **Authentication:** JWT-based, Social login (Google, Facebook)
- **API:** Connects to a Strapi backend (see `.env` for endpoints)
- **Other:** ESLint, PostCSS

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

```bash
git clone <repo-url>
cd frontend
npm install
# or
yarn install
```

### Development

```bash
npm run dev
# or
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## Project Structure

```
app/
  ├── admin/           # Admin dashboard, login, user/vendor/order/payment/global-settings management
  ├── become-a-vendor/ # Vendor registration flow
  ├── cart/            # User cart and checkout
  ├── category/        # Category browsing
  ├── checkout/        # Checkout process
  ├── components/      # Shared UI components (Navbar, Footer, etc.)
  ├── explore/         # Explore dishes and vendors
  ├── login/           # User login
  ├── orders/          # User order details
  ├── profile/         # User profile, order history, settings
  ├── signup/          # User signup
  ├── vendor/          # Vendor dashboard, inventory, orders, payments, settings
  └── ...              # Other pages (privacy, terms, etc.)
components/
  └── ui/              # Reusable UI primitives
public/
  └── ...              # Static assets (images, fonts)
```

---

## Scripts

- `npm run dev` – Start development server
- `npm run build` – Build for production
- `npm start` – Start production server
- `npm run lint` – Run ESLint

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

**For more details, see the code and comments in each directory.**
