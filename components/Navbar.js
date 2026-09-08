'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Menu, X, Search } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const { itemCount, setIsOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'saturate(180%) blur(14px)',
        WebkitBackdropFilter: 'saturate(180%) blur(14px)',
        borderBottom: `1px solid ${scrolled ? 'var(--line)' : 'transparent'}`,
        transition: 'border-color 0.2s ease',
      }}
    >
      <div className="container-wide flex items-center justify-between navbar-inner" style={{ height: 78 }}>

        {/* Logo — más grande, identidad principal (se achica en móvil) */}
        <Link href="/" className="flex items-center navbar-brand" style={{ textDecoration: 'none', gap: 10, minWidth: 0 }}>
          <div className="navbar-logo" style={{
            width: 54, height: 54, borderRadius: '50%', overflow: 'hidden',
            background: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Image
              src="/logo.png"
              alt="Lucasports"
              width={54}
              height={54}
              style={{ borderRadius: '50%', objectFit: 'cover' }}
            />
          </div>
          <div style={{ minWidth: 0 }}>
            <p className="navbar-title" style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '1.35rem',
              color: 'var(--ink)',
              lineHeight: 1,
              letterSpacing: '-0.02em',
              whiteSpace: 'nowrap',
            }}>
              LUCASPORTS
            </p>
            <p style={{
              fontSize: '0.68rem',
              color: 'var(--muted)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginTop: 4,
              fontWeight: 500,
            }}>
              Temporada 26/27
            </p>
          </div>
        </Link>

        {/* Links escritorio */}
        <div className="hidden md:flex items-center" style={{ gap: 36 }}>
          {[
            { href: '/', label: 'Inicio' },
            { href: '/productos', label: 'Tienda' },
            { href: '/ofertas', label: 'Ofertas' },
            { href: '/contacto', label: 'Contacto' },
          ].map(l => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.9rem',
                fontWeight: 500,
                color: 'var(--ink)',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              className="hover:opacity-60"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Acciones */}
        <div className="flex items-center" style={{ gap: 8 }}>
          <Link href="/productos" aria-label="Buscar" className="hidden sm:flex" style={{
            width: 40, height: 40, borderRadius: '50%',
            alignItems: 'center', justifyContent: 'center',
            color: 'var(--ink)', transition: 'background 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-alt)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <Search size={18} />
          </Link>

          <button
            onClick={() => setIsOpen(true)}
            aria-label="Carrito"
            className="relative"
            style={{
              width: 40, height: 40, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: 'var(--ink)', transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-alt)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <ShoppingBag size={18} />
            {itemCount > 0 && (
              <span style={{
                position: 'absolute', top: 4, right: 4,
                background: 'var(--season)', color: '#fff',
                fontSize: '0.6rem', fontWeight: 700,
                width: 16, height: 16, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid var(--bg)',
              }}>
                {itemCount}
              </span>
            )}
          </button>

          <a
            href="https://wa.me/573174721539"
            target="_blank"
            rel="noreferrer"
            className="hidden md:inline-flex btn-whatsapp"
            style={{ padding: '10px 18px', fontSize: '0.82rem' }}
          >
            💬 WhatsApp
          </a>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden"
            aria-label="Menu"
            style={{
              width: 40, height: 40, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: 'var(--ink)',
            }}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      {menuOpen && (
        <div
          className="md:hidden"
          style={{
            background: 'var(--surface)',
            borderTop: '1px solid var(--line)',
            padding: '20px 24px',
            display: 'flex', flexDirection: 'column', gap: 16,
          }}
        >
          {[
            { href: '/', label: 'Inicio' },
            { href: '/productos', label: 'Tienda' },
            { href: '/ofertas', label: 'Ofertas' },
            { href: '/contacto', label: 'Contacto' },
          ].map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.05rem',
                fontWeight: 600,
                color: 'var(--ink)',
                textDecoration: 'none',
              }}
            >
              {l.label}
            </Link>
          ))}
          <a
            href="https://wa.me/573174721539"
            target="_blank"
            rel="noreferrer"
            className="btn-whatsapp"
            style={{ marginTop: 8, justifyContent: 'center' }}
          >
            💬 Pedir por WhatsApp
          </a>
        </div>
      )}
    </nav>
  );
}
