import { Montserrat } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import Header from "./components/Header";
import Footer from "./components/Footer";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata = {
  title: "Restaurant Supply Store",
  description: "A one-stop shop for all your restaurant supply needs.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={montserrat.className}>
      <body
        className="antialiased min-h-screen flex flex-col"
        suppressHydrationWarning
      >
        <CartProvider>
          <WishlistProvider>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
