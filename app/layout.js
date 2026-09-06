import './globals.css';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';

export const metadata = {
  title: "Lucasports — Camisetas de Fútbol · Temporada 26/27",
  description: "Tienda de camisetas oficiales, retro y de entrenamiento de las grandes ligas y selecciones. Envíos a toda Colombia con pago contra entrega. Desde Manizales.",
  keywords: "camisetas futbol, temporada 26/27, premier league, laliga, serie a, bundesliga, camisetas retro, lucasports, manizales",
  openGraph: {
    title: "Lucasports — Camisetas de Fútbol Temporada 26/27",
    description: "Camisetas oficiales de tus clubes y selecciones favoritas. Pago contra entrega, envíos a toda Colombia.",
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
