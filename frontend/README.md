# ChithisFoods Frontend

A modern multi-vendor food delivery platform connecting local chefs and home cooks with food lovers. This is the frontend (Next.js) application for ChithisFoods, supporting three main user roles: **User**, **Vendor**, and **Admin**.

**Live Demo:** [chithisfoods.vercel.app](https://chithisfoods.vercel.app)  
**Repository:** [https://github.com/NIAZI77/chithisfoods](https://github.com/NIAZI77/chithisfoods)  
**Last Updated:** December 2024

---

## Table of Contents

- [Features](#features)
  - [User](#user)
  - [Vendor](#vendor)
  - [Admin](#admin)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Pages & Components Map](#pages--components-map)
- [How to Add a New Page or Component](#how-to-add-a-new-page-or-component)
- [Role-based Navigation](#role-based-navigation)
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

- **Framework:** [Next.js 15.3.0](https://nextjs.org/) with App Router and Turbopack
- **UI:** React 19, Tailwind CSS v4, MUI v7.1.1, Radix UI components
- **Icons:** Lucide React v0.487.0, React Icons v5.5.0
- **State & Utilities:** React Hooks, Cookies Next v5.1.0, React Toastify v11.0.5
- **Date Handling:** Day.js v1.11.13, Date-fns v3.6.0, MUI X Date Pickers v8.5.2
- **Charts & Visualization:** Recharts v2.15.3
- **Carousel/Slider:** Swiper v11.2.8
- **Maps:** React Google Maps API v2.20.7
- **Authentication:** JWT-based, Social login (Google, Facebook)
- **API:** Connects to a Strapi v5.12.4 backend (see `.env` for endpoints)
- **Styling:** Tailwind CSS v4 with custom components and animations
- **Development:** ESLint v9, PostCSS, TypeScript support

---

## Getting Started

### Prerequisites

- Node.js (v20.17.0 recommended)
- npm (v10.8.2 recommended) or yarn

### Installation

```bash
git clone https://github.com/NIAZI77/chithisfoods.git
cd chithisfoods/frontend
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

**Note:** 
- Uses Turbopack for faster development builds
- Make sure the backend server is running on port 1337 for full functionality
- Backend should be Strapi v5.12.4 for compatibility

### Build for Production

```bash
npm run build
npm start
```

## Environment Variables: .env and .env.example

- **.env**: Stores sensitive configuration (API base URLs, public keys, etc.) required for the frontend to run. **You must create and configure this file before running `npm run start` or `npm run dev`.**
- **.env.example**: A template file listing all required environment variables (without secrets). Use this as a reference for your own .env.

### How to use
1. Copy `.env.example` to `.env`
2. Fill in the required values
3. Start the frontend

```bash
cp .env.example .env
# Edit .env and fill in your secrets and config
```

- **Never commit your `.env` file** to version control.
- Always update `.env.example` when you add new required environment variables.

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

## Pages & Components Map

### Main Pages
- `admin/`
  - `dashboard/` (page.js)
  - `global-settings/` (page.js, components: CategoryForm.js, TaxPercentage.js)
  - `login/` (page.js)
  - `orders/` (page.js, components: OrdersTable.js, Filters.js, MetricsCards.js)
  - `payments/` (page.js, components: TaxMetrics.js, PaymentOrdersTable.js, PaymentMetrics.js, PaymentConfirmationDialog.js, PaymentFilters.js)
  - `users-and-vendors/` (page.js, components: VendorsTable.jsx, VendorVerificationModal.js, UsersTable.jsx, UserDetailsModal.jsx, Charts.jsx, MetricsCards.jsx, Pagination.jsx)
- `vendor/`
  - `dashboard/` (page.js)
  - `add-dish/` (page.js)
  - `edit-dish/[id]/` (page.js)
  - `manage-inventory/` (page.js)
  - `order-management/` (page.js, components: StatusBadge.js, StatusSummary.js, OrderDetailsDialog.js, OrderCard.js)
  - `payment/` (page.js)
  - `settings/` (page.js)
- `orders/`
  - `[id]/` (page.js, components: VendorOrderGroup.js, dialog.jsx, ReviewDialog.js, RefundDialog.js, OrderSummary.js, OrderDetails.js, OrderHeader.js, OrderStatusBadge.js)
- Other main pages: become-a-vendor/, cart/, category/, checkout/, explore/, forget-password/, login/, not-found.js, profile/, reset-password/, signup/, terms-and-conditions/, thank-you/, vendors/.

---

## How to Add a New Page or Component

- **Add a new page:**
  1. Create a new folder under `app/` (e.g., `app/new-feature/`).
  2. Add a `page.js` file for the route.
  3. Add any subfolders/components as needed.
- **Add a new component:**
  1. Place shared components in `app/components/`.
  2. Place page-specific components in the relevant page's `components/` subfolder.
- **Add a new admin/vendor/user feature:**
  1. Place under the respective role directory (e.g., `admin/`, `vendor/`).

---

## Role-based Navigation

- **User:** `/`, `/category/`, `/cart/`, `/orders/`, `/profile/`, `/explore/`, `/login/`, `/signup/`, `/forget-password/`, `/reset-password/`, `/thank-you/`, `/vendors/`, `/terms-and-conditions/`, `/privacy-policy/`
- **Vendor:** `/vendor/dashboard/`, `/vendor/manage-inventory/`, `/vendor/order-management/`, `/vendor/payment/`, `/vendor/vendor-profile/`, `/vendor/settings/`, `/vendor/add-dish/`, `/vendor/edit-dish/[id]/`
- **Admin:** `/admin/login/`, `/admin/dashboard/`, `/admin/users-and-vendors/`, `/admin/orders/`, `/admin/payments/`, `/admin/global-settings/`

---

## Scripts

- `npm run dev` – Start development server (with hot reload)
- `npm run build` – Build for production
- `npm start` – Start production server
- `npm run lint` – Run ESLint
- `npm run lint:fix` – Fix ESLint issues automatically

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

- **Top Chefs & Popular Dishes:** Homepage and Explore now show top vendors and dishes for the week, based on weekly sales (fields: weeklyItemsSold for vendors, weeklySalesCount for dishes). These stats reset every Monday at midnight (powered by backend cron job, see [backend/README.md](../backend/README.md) for details).
