'use client';
import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
 
export default function Navbar() {
  const { itemCount, setIsOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
 
  return (
    <nav style={{ backgroundColor: '#003893', borderBottom: '4px solid #FCD116' }}
      className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
 
        {/* Logo */}
<Link href="/" className="flex items-center gap-3">
  <Image
    src="/logo.png"
    alt="Logo Luca'Sports"
    width={64}
    height={64}
    style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
  />
  <div>
    <p style={{
      fontFamily: 'Bebas Neue, sans-serif', color: '#FCD116',
      fontSize: '2.5rem', lineHeight: 1, letterSpacing: '0.05em'
    }}>
      LUCASPORTS
    </p>
    <p style={{ fontSize: '0.55rem', color: '#ffffff', letterSpacing: '0.35em', textTransform: 'uppercase' }}>
      Manizales · Colombia 🇨🇴
    </p>
  </div>
</Link>
 
        {/* Links escritorio */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { href: '/', label: 'Inicio' },
            { href: '/productos', label: 'Productos' },
            { href: '/contacto', label: 'Contacto' },
          ].map(l => (
            <Link key={l.href} href={l.href}
              style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.05rem', color: '#fff', letterSpacing: '0.1em' }}
              className="hover:text-yellow-400 transition-colors">
              {l.label}
            </Link>
          ))}
          <a href="https://wa.me/573174721539" target="_blank"
            style={{
              background: '#25D366', color: '#fff',
              fontFamily: 'Bebas Neue, sans-serif', fontSize: '0.9rem',
              letterSpacing: '0.1em', padding: '6px 16px', borderRadius: 2
            }}>
            💬 WHATSAPP
          </a>
        </div>
 
        {/* Carrito + menú móvil */}
        <div className="flex items-center gap-3">
          <button onClick={() => setIsOpen(true)} className="relative p-2">
            <ShoppingCart color="#FCD116" size={26} />
            {itemCount > 0 && (
              <span style={{
                background: '#CE1126', color: '#fff', fontSize: '0.65rem',
                fontWeight: 'bold', position: 'absolute', top: 0, right: 0,
                width: 18, height: 18, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
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
        <div style={{ background: '#002580', borderTop: '1px solid #FCD11633' }}
          className="md:hidden px-4 py-5 flex flex-col gap-5">
          {[
            { href: '/', label: 'Inicio' },
            { href: '/productos', label: 'Productos' },
            { href: '/contacto', label: 'Contacto' },
          ].map(l => (
            <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
              style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.4rem', color: '#FCD116', letterSpacing: '0.1em' }}>
              {l.label}
            </Link>
          ))}
          <a href="https://wa.me/573174721539" target="_blank"
            style={{
              background: '#25D366', color: '#fff', fontFamily: 'Bebas Neue, sans-serif',
              fontSize: '1rem', letterSpacing: '0.1em', padding: '10px 20px',
              display: 'inline-block', textAlign: 'center'
            }}>
            💬 PEDIR POR WHATSAPP
          </a>
        </div>
      )}
    </nav>
  );
}