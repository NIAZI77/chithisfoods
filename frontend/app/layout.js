import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import AdminSidebar from "./components/adminSidebar";
import VendorSidebar from "./components/vendorSidebar";

export const metadata = {
  title: "ChithisFoods",
  description:
    "ChithisFoods is a multi-vendor food delivery platform that connects local chefs and home cooks with food lovers. Explore a diverse range of homemade, authentic meals, snacks, and desserts, delivered fresh to your door. Discover unique flavors while supporting local culinary talent, all with a simple and convenient ordering experience.",
  keywords: "food delivery, multi-vendor, local chefs, home cooks, homemade food, authentic meals, food platform, local cuisine, food ordering, fresh food delivery",
  authors: [{ name: "ChithisFoods Team" }],
  creator: "ChithisFoods",
  publisher: "ChithisFoods",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://chithisfoods.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "ChithisFoods",
    description: "ChithisFoods is a multi-vendor food delivery platform that connects local chefs and home cooks with food lovers. Explore a diverse range of homemade, authentic meals, snacks, and desserts, delivered fresh to your door.",
    url: 'https://chithisfoods.com',
    siteName: 'ChithisFoods',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'ChithisFoods',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ChithisFoods',
    description: 'ChithisFoods is a multi-vendor food delivery platform that connects local chefs and home cooks with food lovers.',
    images: ['/logo.png'],
    creator: '@chithisfoods',
    site: '@chithisfoods',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/logo.png' },
    ],
    apple: [
      { url: '/logo.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body cz-shortcut-listen="true">
        <Navbar />
        <VendorSidebar />
        <AdminSidebar />
        <div className="min-h-screen">{children}</div>
        <Footer />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </body>
    </html>
  );
}
