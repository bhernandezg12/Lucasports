'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * HeroCarousel — media pantalla, hasta N slides
 *
 * Prioridad de contenido:
 *  1. slidesAdmin (colección Firestore `banners_hero` gestionada desde /admin)
 *  2. productos destacados (mapeados como slide)
 *  3. SLIDES_FALLBACK (estáticos)
 */

const SLIDES_FALLBACK = [
  { id: 'fb-1', tag: 'Nuevo · Temporada 26/27', titulo: 'Las Grandes Ligas Están de Vuelta',
    subtitulo: 'Camisetas oficiales de tus clubes favoritos.', cta: 'Explorar tienda',
    href: '/productos', imageUrl: '', liga: 'TEMPORADA 26/27' },
  { id: 'fb-2', tag: 'Selecciones', titulo: 'Viste los Colores de tu País',
    subtitulo: 'Las camisetas de las selecciones rumbo al Mundial 2026.', cta: 'Ver selecciones',
    href: '/productos?cat=Selecciones', imageUrl: '', liga: 'INTERNACIONAL' },
  { id: 'fb-3', tag: 'Retro · Coleccionista', titulo: 'Camisetas Clásicas que Marcaron Época',
    subtitulo: 'Rediseños vintage de los partidos que nunca olvidarás.', cta: 'Ver retro',
    href: '/productos?cat=Retro', imageUrl: '', liga: 'COLECCIÓN RETRO' },
  { id: 'fb-4', tag: 'Preventa · LaLiga', titulo: 'LaLiga 26/27 en Preventa',
    subtitulo: 'Reserva la camiseta de tu club antes del kickoff.', cta: 'Ver LaLiga',
    href: '/productos?cat=LaLiga', imageUrl: '', liga: 'LALIGA' },
  { id: 'fb-5', tag: 'Envío nacional', titulo: 'Pago Contra Entrega en Toda Colombia',
    subtitulo: 'Recibe tu camiseta en tu casa y paga al recibir.', cta: 'Cómo pedir',
    href: '/contacto', imageUrl: '', liga: 'ENVÍOS' },
];

export default function HeroCarousel({ productos = [], slidesAdmin = [] }) {
  // 1) Si el admin cargó slides personalizados, usarlos
  // 2) Si no, generar desde productos destacados
  // 3) Si tampoco, fallback estático
  let slides;
  if (slidesAdmin.length > 0) {
    slides = slidesAdmin.slice(0, 8).map(sl => ({
      id: sl.id,
      tag: sl.tag || 'Lucasports',
      titulo: sl.titulo || 'Lucasports',
      subtitulo: sl.subtitulo || '',
      cta: sl.cta || 'Ver más',
      href: sl.href || '/productos',
      imageUrl: sl.imageUrl || '',
      liga: (sl.liga || 'LUCASPORTS').toUpperCase(),
      precio: sl.precio,
    }));
  } else if (productos.length > 0) {
    slides = productos.slice(0, 5).map(p => ({
      id: p.id,
      tag: p.liga || p.categoria || 'Nuevo · 26/27',
      titulo: p.nombre,
      subtitulo: p.descripcion?.slice(0, 130) || 'Camiseta oficial de la temporada 26/27.',
      cta: 'Ver producto',
      href: `/productos/${p.id}`,
      imageUrl: p.imageUrls?.[0] || p.imageUrl || '',
      liga: (p.liga || p.categoria || 'TEMPORADA 26/27').toUpperCase(),
      precio: p.precio,
    }));
  } else {
    slides = SLIDES_FALLBACK;
  }

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
      paddingTop: 100,
      paddingBottom: 24,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div className="container-wide">

        {/* Grid del hero: media pantalla */}
        <div
          className="grid grid-cols-1 lg:grid-cols-2 hero-grid"
          style={{
            gap: 40,
            alignItems: 'center',
            minHeight: 'min(50vh, 460px)',
            opacity: fade ? 0 : 1,
            transition: 'opacity 0.22s ease',
          }}
        >
          {/* Columna texto */}
          <div style={{ maxWidth: 560 }}>
            <div className="chip chip-light" style={{ marginBottom: 16 }}>
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
              fontSize: 'clamp(2rem, 4.8vw, 3.6rem)',
              lineHeight: 1.02,
              color: 'var(--ink)',
              letterSpacing: '-0.03em',
              marginBottom: 18,
            }}
            className="text-balance"
            >
              {s.titulo}
            </h1>

            {s.subtitulo && (
              <p style={{
                fontSize: '1rem',
                lineHeight: 1.55,
                color: 'var(--muted)',
                marginBottom: 22,
                maxWidth: 480,
              }}>
                {s.subtitulo}
              </p>
            )}

            {s.precio > 0 && (
              <p style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '1.35rem',
                color: 'var(--ink)',
                marginBottom: 20,
              }}>
                ${Number(s.precio).toLocaleString('es-CO')}
                <span style={{ fontSize: '0.8rem', color: 'var(--muted)', marginLeft: 8, fontWeight: 400 }}>
                  COP
                </span>
              </p>
            )}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              <Link href={s.href} style={{ textDecoration: 'none' }}>
                <button className="btn-primary">
                  {s.cta} →
                </button>
              </Link>
              <a
                href="https://wa.me/573174721539?text=Hola%20Lucasports!%20Quiero%20info"
                target="_blank"
                rel="noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <button className="btn-outline">
                  💬 WhatsApp
                </button>
              </a>
            </div>
          </div>

          {/* Columna imagen — más compacta (media pantalla) */}
          <div style={{
            position: 'relative',
            aspectRatio: '16/11',
            maxHeight: 420,
            width: '100%',
            borderRadius: 18,
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
                <div style={{ fontSize: '5rem', opacity: 0.22 }}>👕</div>
                <p style={{ marginTop: 8, fontSize: '0.8rem', color: 'var(--muted-2)', fontWeight: 500 }}>
                  Imagen próximamente
                </p>
              </div>
            )}

            <div style={{
              position: 'absolute', top: 16, left: 16,
              background: 'rgba(11,11,11,0.85)', color: '#fff',
              padding: '6px 12px', borderRadius: 999,
              fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.05em',
              backdropFilter: 'blur(8px)',
            }}>
              {s.liga}
            </div>

            <div style={{
              position: 'absolute', bottom: 16, right: 16,
              background: 'rgba(255,255,255,0.9)', color: 'var(--ink)',
              padding: '5px 12px', borderRadius: 999,
              fontSize: '0.72rem', fontWeight: 600,
              backdropFilter: 'blur(8px)',
            }}>
              {String(actual + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </div>
          </div>
        </div>

        {/* Controles */}
        {slides.length > 1 && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginTop: 18, paddingTop: 16,
            borderTop: '1px solid var(--line)',
          }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => cambiar(i)}
                  aria-label={`Slide ${i + 1}`}
                  style={{
                    width: i === actual ? 24 : 8, height: 8,
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
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'var(--surface)', border: '1px solid var(--line)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--ink)', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--ink)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.color = 'var(--ink)'; }}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => cambiar(actual + 1)}
                aria-label="Siguiente"
                style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'var(--surface)', border: '1px solid var(--line)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--ink)', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--ink)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.color = 'var(--ink)'; }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
