import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import "./globals.css";

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
        <div className="min-h-screen">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
