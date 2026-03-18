'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const { itemCount, setIsOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={{ backgroundColor: '#003893', borderBottom: '3px solid #FCD116' }}
      className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-3xl">🇨🇴</span>
          <div>
            <p style={{ fontFamily: 'Bebas Neue, sans-serif', color: '#FCD116', fontSize: '1.4rem', lineHeight: 1 }}>
              LA TRICOLOR
            </p>
            <p style={{ fontSize: '0.6rem', color: '#ffffff99', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              Tienda Oficial
            </p>
          </div>
        </Link>

        {/* Links escritorio */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.1rem', color: '#fff', letterSpacing: '0.1em' }}
            className="hover:text-yellow-400 transition-colors">Inicio</Link>
          <Link href="/productos" style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.1rem', color: '#fff', letterSpacing: '0.1em' }}
            className="hover:text-yellow-400 transition-colors">Productos</Link>
          <Link href="/contacto" style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.1rem', color: '#fff', letterSpacing: '0.1em' }}
            className="hover:text-yellow-400 transition-colors">Contacto</Link>
        </div>

        {/* Carrito + menú móvil */}
        <div className="flex items-center gap-4">
          <button onClick={() => setIsOpen(true)} className="relative p-2">
            <ShoppingCart color="#FCD116" size={26} />
            {itemCount > 0 && (
              <span style={{ background: '#CE1126', color: '#fff', fontSize: '0.7rem', fontWeight: 'bold' }}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
          
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
            {menuOpen ? <X color="#FCD116" size={26} /> : <Menu color="#FCD116" size={26} />}
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      {menuOpen && (
        <div style={{ background: '#003893', borderTop: '1px solid #FCD11644' }} className="md:hidden px-4 py-4 flex flex-col gap-4">
          <Link href="/" onClick={() => setMenuOpen(false)} style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.3rem', color: '#FCD116', letterSpacing: '0.1em' }}>
            Inicio
          </Link>
          <Link href="/productos" onClick={() => setMenuOpen(false)} style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.3rem', color: '#FCD116', letterSpacing: '0.1em' }}>
            Productos
          </Link>
          <Link href="/contacto" onClick={() => setMenuOpen(false)} style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.3rem', color: '#FCD116', letterSpacing: '0.1em' }}>
            Contacto
          </Link>
        </div>
      )}
    </nav>
  );
}