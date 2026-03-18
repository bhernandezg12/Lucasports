import './globals.css';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';

export const metadata = {
  title: "Luca'Sports — Camisetas Selección Colombia 🇨🇴",
  description: "Camisetas oficiales y conmemorativas de la Selección Colombia. Desde Manizales con envíos a toda Colombia. Pago contra entrega.",
  keywords: "camisetas colombia, seleccion colombia, camiseta mundial 2026, lucasports, manizales",
  openGraph: {
    title: "Luca'Sports — Camisetas Selección Colombia",
    description: "Camisetas oficiales de la Tricolor. Pago contra entrega. Envíos a toda Colombia.",
    locale: 'es_CO',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <CartProvider>
          <Navbar />
          <CartDrawer />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
