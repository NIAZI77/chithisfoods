import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./globals.css";
import VendorSideBar from "./components/VendorSideBar";

export const metadata = {
  title: "ChithisFoods",
  description: "Homemade meals delivered to your door with ChithisFoods. Support local cooks and enjoy delicious dishes at home.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`antialiased`} cz-shortcut-listen="true">
        <Navbar />
        <VendorSideBar/>
        <div className="min-h-screen">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
