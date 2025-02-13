# ChithisFoods.com

Welcome to **ChithisFoods.com** – a platform where food lovers can explore, order, and enjoy homemade, authentic dishes made with love by local chefs and home cooks. Whether you're craving comfort food, healthy meals, or something exotic, we've got something for everyone, cooked fresh and delivered to your doorstep.

---

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [How It Works](#how-it-works)
- [Chefs & Cooks](#chefs--cooks)
- [Menu](#menu)
- [Delivery](#delivery)
- [Customer Reviews](#customer-reviews)
- [Technology Stack](#technology-stack)
- [Contributing](#contributing)
- [License](#license)

---

## Introduction

**ChithisFoods.com** connects food lovers with local chefs and home cooks, offering a variety of fresh, homemade meals. The platform lets you discover new dishes, place orders directly from chefs, and have your meals delivered to your door. Support local creators and enjoy a truly authentic dining experience!

---

## Features

- **Diverse Menu**: Explore a variety of homemade dishes ranging from comfort food to innovative fusion meals.
- **Chef Profiles**: Learn about the chefs, their cooking styles, and the ingredients they use.
- **Order Online**: Browse menus, customize orders, and pay securely via PayPal.
- **Delivery Service**: Get meals delivered to your home or office.
- **Customer Reviews**: Read and leave feedback on dishes and chefs.
- **Weekly Specials**: Discover new dishes and limited-time offers.

---

## How It Works

1. **Sign Up / Log In**  
   Create an account or log in to start browsing the menu and place orders.

2. **Browse the Menu**  
   Search for dishes based on cuisine, chef, or dietary preferences. Check out photos, descriptions, and ratings.

3. **Order and Pay**  
   Select your items, customize your order, and pay securely via **PayPal**.

4. **Delivery to Your Door**  
   Sit back and relax while your meal is prepared and delivered to your doorstep.

5. **Enjoy Your Meal**  
   Enjoy your delicious food, and leave a review to help other customers make great choices.

---

## Chefs & Cooks

At **ChithisFoods.com**, we collaborate with passionate home cooks and chefs who are dedicated to creating unique, delicious dishes. Whether they specialize in local favorites or global flavors, our chefs put their heart into every meal.

Want to become a chef on **ChithisFoods.com**? [Sign up to become a chef here](#).

---

## Menu

Explore a constantly rotating menu with diverse offerings. Some popular categories include:

- **Indian & South Asian Delights**
- **Italian Classics**
- **Vegan & Vegetarian Options**
- **Gluten-Free**
- **Desserts & Sweet Treats**

---

## Delivery

We offer reliable and efficient delivery to ensure your meals reach you fresh and on time. Delivery times depend on the chef’s location and order volume. You'll get an estimated time at checkout.

**Currently Delivering To**:  
- [List of cities/areas]

---

## Customer Reviews

Customer feedback is essential for maintaining high-quality service. Browse reviews from other users to help you make your decision, and share your own thoughts after your meal!

---

## Technology Stack

**Frontend**:  
- **Next.js**: A React-based framework used for building the user interface and handling server-side rendering (SSR) for fast page loads.
- **Tailwind CSS**: A utility-first CSS framework to style the website responsively and efficiently.

**Backend**:  
- **Strapi**: A headless CMS to manage the content, chef profiles, and menu items. It provides an API for the frontend to fetch data dynamically.

**Payment Gateway**:  
- **PayPal**: Integrated for secure online payments, allowing users to pay for their meals via PayPal.

**Hosting**:  
- **Vercel**: Used for hosting the Next.js frontend.
- **Heroku / AWS**: Used for hosting the Strapi backend and ensuring scalability.

**Database**:  
- **MongoDB**: NoSQL database for storing orders, chef profiles, and menu items.

---

## Contributing

We welcome contributions from developers, designers, and food enthusiasts! If you’d like to contribute to **ChithisFoods.com**, feel free to fork the repository and submit a pull request.

To get started:
1. Fork the repo.
2. Clone the repo locally.
3. Create a new branch for your feature or bug fix.
4. Submit a pull request with a description of your changes.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Thank you for visiting **ChithisFoods.com** – your source for delicious, homemade meals delivered with love!




# Website Configuration

This README provides instructions on how to configure the environment variables for your website. Make sure to update the values in your `.env` file with the correct information before deploying your application.

## Environment Variables

### 1. Host Configuration

The following environment variables define the host URLs for your website and Strapi backend.

```bash
NEXT_PUBLIC_HOST=your-app-url
NEXT_PUBLIC_STRAPI_HOST=your-strapi-url
