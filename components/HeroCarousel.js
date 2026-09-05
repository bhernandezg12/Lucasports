'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// ← Edita estos slides directamente aquí
// Cuando tengas las fotos de tus camisetas, cambia imageUrl
const SLIDES = [
  {
    id: 1,
    badge: '🇨🇴 MUNDIAL 2026',
    titulo: 'Camiseta Oficial\nLocal Colombia 2026',
    subtitulo: 'La camiseta de la Tricolor para el sueño mundialista',
    precio: 89000,
    cta: 'Ver producto',
    href: '/productos',
    bg: 'linear-gradient(135deg, #003893 0%, #001f5c 60%, #0A0A0A 100%)',
    acento: '#FCD116',
    imageEmoji: '👕',
    imageUrl: '',   // ← cuando tengas la foto, ponla aquí
  },
  {
    id: 2,
    badge: '⚽ ENTRENAMIENTO',
    titulo: 'Camiseta Oficial\nEntrenamiento Blanca',
    subtitulo: 'La misma calidad que usa la Selección en cada práctica',
    precio: 75000,
    cta: 'Ver producto',
    href: '/productos',
    bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)',
    acento: '#FFFFFF',
    imageEmoji: '👕',
    imageUrl: '',
  },
  {
    id: 3,
    badge: '🏆 EDICIÓN LIMITADA',
    titulo: 'Camiseta\nConmemorativa 100 Años',
    subtitulo: 'Un siglo de historia y pasión. Edición de coleccionista.',
    precio: 99000,
    cta: 'Ver producto',
    href: '/productos',
    bg: 'linear-gradient(135deg, #6B2D4A 0%, #A85F72 60%, #C4798A 100%)',
    acento: '#FCD116',
    imageEmoji: '🏆',
    imageUrl: '',
  },
];

export default function HeroCarousel() {
  const [actual, setActual] = useState(0);
  const [animando, setAnimando] = useState(false);

  const cambiarSlide = (nuevo) => {
    if (animando) return;
    setAnimando(true);
    setTimeout(() => {
      setActual(nuevo);
      setAnimando(false);
    }, 300);
  };

  // Auto-avance cada 5 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      cambiarSlide((actual + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [actual, animando]);

  const slide = SLIDES[actual];

  return (
    <section style={{
      background: slide.bg,
      minHeight: '92vh',
      display: 'flex', alignItems: 'center',
      position: 'relative', overflow: 'hidden',
      transition: 'background 0.8s ease',
    }}>
      {/* Decorativos de fondo */}
      <div style={{ position: 'absolute', right: '-8%', top: '50%', transform: 'translateY(-50%)', width: '55%', height: '130%', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }} />

      {/* Contenido */}
      <div className="max-w-7xl mx-auto px-4 w-full"
        style={{ opacity: animando ? 0 : 1, transition: 'opacity 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32 }}>

        {/* Texto */}
        <div style={{ maxWidth: 580, flex: 1 }}>
          <span style={{
            background: slide.acento, color: '#000',
            fontFamily: 'Bebas Neue, sans-serif', fontSize: '0.8rem',
            letterSpacing: '0.25em', padding: '5px 16px',
            display: 'inline-block', marginBottom: 20,
          }}>
            {slide.badge}
          </span>

          <h1 style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: 'clamp(3rem, 8vw, 6rem)',
            color: '#fff', lineHeight: 0.92,
            whiteSpace: 'pre-line', marginBottom: 20,
          }}>
            {slide.titulo}
          </h1>

          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', lineHeight: 1.7, marginBottom: 28 }}>
            {slide.subtitulo}
          </p>

          {slide.precio > 0 && (
            <p style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: '2.5rem', color: slide.acento,
              marginBottom: 28, lineHeight: 1,
            }}>
              ${slide.precio.toLocaleString('es-CO')}
              <span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)', marginLeft: 8, fontFamily: 'Barlow, sans-serif' }}>COP</span>
            </p>
          )}

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <Link href={slide.href} style={{ textDecoration: 'none' }}>
              <button style={{
                background: slide.acento, color: slide.acento === '#FFFFFF' ? '#003893' : '#000',
                fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.05rem',
                letterSpacing: '0.15em', padding: '15px 36px',
                border: 'none', cursor: 'pointer',
              }}>
                {slide.cta} →
              </button>
            </Link>
            <a href="https://wa.me/573174721539" target="_blank" style={{ textDecoration: 'none' }}>
              <button style={{
                background: '#25D366', color: '#fff',
                fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.05rem',
                letterSpacing: '0.12em', padding: '15px 32px',
                border: 'none', cursor: 'pointer',
              }}>
                💬 WhatsApp
              </button>
            </a>
          </div>
        </div>

        {/* Imagen del producto */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', maxWidth: 400 }}
          className="hidden md:flex">
          {slide.imageUrl ? (
            <img src={slide.imageUrl} alt={slide.titulo}
              style={{ width: '100%', maxWidth: 380, objectFit: 'contain', filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.4))' }} />
          ) : (
            <div style={{ fontSize: '14rem', opacity: 0.15, userSelect: 'none' }}>{slide.imageEmoji}</div>
          )}
        </div>
      </div>

      {/* Navegación puntos */}
      <div style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 10 }}>
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => cambiarSlide(i)}
            style={{
              width: i === actual ? 28 : 8, height: 8,
              borderRadius: 4,
              background: i === actual ? slide.acento : 'rgba(255,255,255,0.3)',
              border: 'none', cursor: 'pointer',
              transition: 'all 0.3s ease', padding: 0,
            }} />
        ))}
      </div>

      {/* Flechas */}
      <button onClick={() => cambiarSlide((actual - 1 + SLIDES.length) % SLIDES.length)}
        style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', width: 44, height: 44, fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        ‹
      </button>
      <button onClick={() => cambiarSlide((actual + 1) % SLIDES.length)}
        style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', width: 44, height: 44, fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        ›
      </button>

      {/* Contador */}
      <div style={{ position: 'absolute', top: 24, right: 24, fontFamily: 'Bebas Neue, sans-serif', color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', letterSpacing: '0.1em' }}>
        {String(actual + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
      </div>
    </section>
  );
}