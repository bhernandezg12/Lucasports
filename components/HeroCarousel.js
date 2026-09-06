'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * HeroCarousel — Estilo Figma "NEW COLLECTION"
 *
 * Recibe hasta 3 productos desde el server y arma slides automáticos.
 * Si no hay productos, muestra slides estáticos con placeholders.
 * ¡El título del producto SÍ aparece porque lo tomamos de `p.nombre`!
 */

const SLIDES_FALLBACK = [
  {
    id: 'fb-1',
    tag: 'Nuevo · Temporada 26/27',
    titulo: 'Las Grandes Ligas Están de Vuelta',
    subtitulo: 'Camisetas oficiales de tus clubes favoritos. Premier League, LaLiga, Serie A, Bundesliga y más.',
    cta: 'Explorar tienda',
    href: '/productos',
    imageUrl: '',
    liga: 'TEMPORADA 26/27',
  },
  {
    id: 'fb-2',
    tag: 'Selecciones',
    titulo: 'Viste los Colores de tu País',
    subtitulo: 'Las camisetas de las selecciones más grandes rumbo al Mundial 2026.',
    cta: 'Ver selecciones',
    href: '/productos?cat=Selecciones',
    imageUrl: '',
    liga: 'INTERNACIONAL',
  },
  {
    id: 'fb-3',
    tag: 'Retro · Coleccionista',
    titulo: 'Camisetas Clásicas que Marcaron Época',
    subtitulo: 'Rediseños vintage de los partidos que nunca olvidarás.',
    cta: 'Ver retro',
    href: '/productos?cat=Retro',
    imageUrl: '',
    liga: 'COLECCIÓN RETRO',
  },
];

export default function HeroCarousel({ productos = [] }) {
  const slides = productos.length > 0
    ? productos.slice(0, 3).map(p => ({
        id: p.id,
        tag: p.liga || p.categoria || 'Nuevo · 26/27',
        titulo: p.nombre,                    // ← ¡el fix! ahora sí aparece el nombre real
        subtitulo: p.descripcion?.slice(0, 130) || 'Camiseta oficial de la temporada 26/27.',
        cta: 'Ver producto',
        href: `/productos/${p.id}`,
        imageUrl: p.imageUrls?.[0] || p.imageUrl || '',
        liga: (p.liga || p.categoria || 'TEMPORADA 26/27').toUpperCase(),
        precio: p.precio,
      }))
    : SLIDES_FALLBACK;

  const [actual, setActual] = useState(0);
  const [fade, setFade] = useState(false);

  const cambiar = (i) => {
    setFade(true);
    setTimeout(() => {
      setActual(((i % slides.length) + slides.length) % slides.length);
      setFade(false);
    }, 220);
  };

  useEffect(() => {
    const t = setInterval(() => cambiar(actual + 1), 6500);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actual]);

  const s = slides[actual];

  return (
    <section style={{
      background: 'var(--bg)',
      paddingTop: 90,
      paddingBottom: 32,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div className="container-wide">

        {/* Grid del hero: texto izquierda, imagen derecha */}
        <div
          className="grid grid-cols-1 lg:grid-cols-2"
          style={{
            gap: 48,
            alignItems: 'center',
            minHeight: 'min(78vh, 720px)',
            opacity: fade ? 0 : 1,
            transition: 'opacity 0.22s ease',
          }}
        >
          {/* Columna texto */}
          <div style={{ maxWidth: 620 }}>
            <div className="chip chip-light" style={{ marginBottom: 20 }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: 'var(--season)',
                animation: 'pulse 1.6s ease-in-out infinite',
              }} />
              {s.tag}
            </div>

            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(2.6rem, 6.4vw, 5.2rem)',
              lineHeight: 0.98,
              color: 'var(--ink)',
              letterSpacing: '-0.03em',
              marginBottom: 24,
            }}
            className="text-balance"
            >
              {s.titulo}
            </h1>

            <p style={{
              fontSize: '1.05rem',
              lineHeight: 1.6,
              color: 'var(--muted)',
              marginBottom: 32,
              maxWidth: 520,
            }}>
              {s.subtitulo}
            </p>

            {s.precio > 0 && (
              <p style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '1.6rem',
                color: 'var(--ink)',
                marginBottom: 28,
              }}>
                ${s.precio.toLocaleString('es-CO')}
                <span style={{ fontSize: '0.85rem', color: 'var(--muted)', marginLeft: 8, fontWeight: 400 }}>
                  COP
                </span>
              </p>
            )}

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <Link href={s.href} style={{ textDecoration: 'none' }}>
                <button className="btn-primary">
                  {s.cta} →
                </button>
              </Link>
              <a
                href="https://wa.me/573174721539?text=Hola%20Lucasports!%20Quiero%20info%20de%20la%20temporada%2026%2F27"
                target="_blank"
                rel="noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <button className="btn-outline">
                  💬 Consultar por WhatsApp
                </button>
              </a>
            </div>

            {/* Trust bar */}
            <div style={{
              display: 'flex', gap: 24, flexWrap: 'wrap',
              marginTop: 40, paddingTop: 24,
              borderTop: '1px solid var(--line)',
            }}>
              {[
                { icon: '💵', text: 'Pago contra entrega' },
                { icon: '📦', text: 'Envíos a toda Colombia' },
                { icon: '⭐', text: 'Productos oficiales' },
              ].map(g => (
                <div key={g.text} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '1rem' }}>{g.icon}</span>
                  <span style={{ color: 'var(--muted)', fontSize: '0.82rem', fontWeight: 500 }}>{g.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Columna imagen */}
          <div style={{
            position: 'relative',
            aspectRatio: '4/5',
            maxHeight: 640,
            borderRadius: 20,
            overflow: 'hidden',
            background: 'var(--surface)',
            border: '1px solid var(--line)',
          }}
            className="placeholder-jersey"
          >
            {s.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={s.imageUrl}
                alt={s.titulo}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: 24 }}>
                <div style={{ fontSize: '7rem', opacity: 0.25 }}>👕</div>
                <p style={{ marginTop: 12, fontSize: '0.85rem', color: 'var(--muted-2)', fontWeight: 500 }}>
                  Imagen próximamente
                </p>
              </div>
            )}

            {/* Badge de liga sobre la imagen */}
            <div style={{
              position: 'absolute', top: 20, left: 20,
              background: 'rgba(11,11,11,0.85)', color: '#fff',
              padding: '8px 14px', borderRadius: 999,
              fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.05em',
              backdropFilter: 'blur(8px)',
            }}>
              {s.liga}
            </div>

            {/* Contador */}
            <div style={{
              position: 'absolute', bottom: 20, right: 20,
              background: 'rgba(255,255,255,0.9)', color: 'var(--ink)',
              padding: '6px 14px', borderRadius: 999,
              fontSize: '0.75rem', fontWeight: 600,
              backdropFilter: 'blur(8px)',
            }}>
              {String(actual + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </div>
          </div>
        </div>

        {/* Controles del carrusel */}
        {slides.length > 1 && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginTop: 24, paddingTop: 20,
            borderTop: '1px solid var(--line)',
          }}>
            <div style={{ display: 'flex', gap: 8 }}>
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => cambiar(i)}
                  aria-label={`Slide ${i + 1}`}
                  style={{
                    width: i === actual ? 28 : 8, height: 8,
                    borderRadius: 999,
                    background: i === actual ? 'var(--ink)' : 'var(--line-strong)',
                    border: 'none', cursor: 'pointer',
                    transition: 'all 0.3s ease', padding: 0,
                  }}
                />
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => cambiar(actual - 1)}
                aria-label="Anterior"
                style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'var(--surface)', border: '1px solid var(--line)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--ink)', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--ink)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.color = 'var(--ink)'; }}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => cambiar(actual + 1)}
                aria-label="Siguiente"
                style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'var(--surface)', border: '1px solid var(--line)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--ink)', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--ink)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.color = 'var(--ink)'; }}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
