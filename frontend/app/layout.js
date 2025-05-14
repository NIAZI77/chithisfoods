import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import Sidebar from "./components/vendorSidebar";

export const metadata = {
  title: "ChithisFoods – Love Every Bite",
  description:
    "ChithisFoods is a multi-vendor food delivery platform that connects local chefs and home cooks with food lovers. Explore a diverse range of homemade, authentic meals, snacks, and desserts, delivered fresh to your door. Discover unique flavors while supporting local culinary talent, all with a simple and convenient ordering experience.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body cz-shortcut-listen="true">
        <Navbar />
        <Sidebar />
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
