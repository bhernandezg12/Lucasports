import Link from 'next/link';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ProductCard from '@/components/ProductCard';
import HeroCarousel from '@/components/HeroCarousel';

// Sin cache: siempre trae la data fresca de Firestore
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Emojis de bandera / icono por defecto (fallback si el admin no especifica)
const ICONO_LIGA = {
  'Premier League': { emoji: '⚽', tag: 'PL' },
  'LaLiga': { emoji: '🇪🇸', tag: 'ES' },
  'Serie A': { emoji: '🇮🇹', tag: 'IT' },
  'Bundesliga': { emoji: '🇩🇪', tag: 'DE' },
  'Ligue 1': { emoji: '🇫🇷', tag: 'FR' },
  'MLS': { emoji: '🇺🇸', tag: 'US' },
  'Selecciones': { emoji: '🌍', tag: 'INT' },
  'Retro': { emoji: '🕰️', tag: 'CLÁSICO' },
  'Entrenamiento': { emoji: '🎽', tag: 'TRAIN' },
  'Liga Colombiana': { emoji: '🇨🇴', tag: 'COL' },
  'Infantil': { emoji: '🧒', tag: 'KIDS' },
};

// Productos placeholder para cuando Firebase esté vacío
const PLACEHOLDERS = [
  { id: 'ph-1', nombre: 'Camiseta Local Real Madrid 26/27', precio: 189000, categoria: 'LaLiga', liga: 'LaLiga', descripcion: 'La nueva camiseta local del Real Madrid para la temporada 26/27.', destacado: true, especial: 'NUEVO' },
  { id: 'ph-2', nombre: 'Camiseta Visitante FC Barcelona 26/27', precio: 189000, categoria: 'LaLiga', liga: 'LaLiga', descripcion: 'Diseño visitante del FC Barcelona con detalles conmemorativos.' },
  { id: 'ph-3', nombre: 'Camiseta Local Manchester City 26/27', precio: 195000, categoria: 'Premier League', liga: 'Premier League', descripcion: 'La icónica camiseta celeste del City.', especial: 'NUEVO' },
  { id: 'ph-4', nombre: 'Camiseta Local Inter Miami 26/27', precio: 219000, categoria: 'MLS', liga: 'MLS', descripcion: 'La camiseta rosada del equipo de Messi.', especial: 'PREVENTA' },
  { id: 'ph-5', nombre: 'Camiseta Selección Argentina Home', precio: 179000, categoria: 'Selecciones', liga: 'Selecciones', descripcion: 'Tres estrellas sobre el pecho.' },
  { id: 'ph-6', nombre: 'Camiseta Retro Brasil 1970', precio: 159000, categoria: 'Retro', liga: 'Retro', descripcion: 'Homenaje al Brasil de Pelé.', especial: 'RETRO' },
];

// Banner publicitario por defecto (fallback)
const BANNER_DEFAULT = {
  activo: true,
  titulo: 'Espacio Publicitario Disponible',
  subtitulo: 'Anuncia tu negocio aquí',
  precio_o_oferta: 'Contáctanos por WhatsApp',
  cta: 'Más información',
  href: 'https://wa.me/573174721539?text=Hola%20Lucasports!%20Quiero%20publicidad%20en%20su%20sitio',
  imagen: '',
  color_fondo: '#0B0B0B',
  color_texto: '#FFFFFF',
  color_acento: '#FFE066',
};

async function getProductos() {
  try {
    const snapshot = await getDocs(collection(db, 'productos'));
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch {
    return [];
  }
}

async function getBannersHero() {
  try {
    const snapshot = await getDocs(collection(db, 'banners_hero'));
    return snapshot.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter(b => b.activo !== false)
      .sort((a, b) => (a.orden || 0) - (b.orden || 0));
  } catch {
    return [];
  }
}

async function getBannerPublicitario() {
  try {
    const snap = await getDoc(doc(db, 'config', 'banner_publicitario'));
    if (snap.exists()) return { ...BANNER_DEFAULT, ...snap.data() };
    return BANNER_DEFAULT;
  } catch {
    return BANNER_DEFAULT;
  }
}

export default async function HomePage() {
  const productosFB = await getProductos();
  const productos = productosFB.length > 0 ? productosFB : PLACEHOLDERS;
  const destacados = productos.slice(0, 6);

  // Slides del hero desde admin (Firestore)
  const slidesAdmin = await getBannersHero();
  const heroProductos = productos.slice(0, 5);

  // Ligas dinámicas: solo las que tienen productos publicados
  const ligasConInventario = Array.from(
    new Set(productos.map(p => p.categoria || p.liga).filter(Boolean))
  ).map(nombre => ({
    label: nombre,
    href: `/productos?cat=${encodeURIComponent(nombre)}`,
    emoji: ICONO_LIGA[nombre]?.emoji || '⚽',
    tag: ICONO_LIGA[nombre]?.tag || nombre.slice(0, 3).toUpperCase(),
    count: productos.filter(p => (p.categoria || p.liga) === nombre).length,
  }));

  const banner = await getBannerPublicitario();

  return (
    <>
      {/* HERO */}
      <HeroCarousel productos={heroProductos} slidesAdmin={slidesAdmin} />

      {/* CATEGORÍAS / LIGAS — solo las que tienen inventario */}
      {ligasConInventario.length > 0 && (
        <section style={{ padding: '40px 0 20px', background: 'var(--bg)' }}>
          <div className="container-wide">
            <div style={{
              display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
              marginBottom: 18, flexWrap: 'wrap', gap: 12,
            }}>
              <div>
                <p style={{
                  color: 'var(--muted)', fontSize: '0.72rem', fontWeight: 600,
                  letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4,
                }}>
                  Explora por liga
                </p>
                <h2 style={{
                  fontFamily: 'var(--font-display)', fontWeight: 700,
                  fontSize: 'clamp(1.15rem, 2vw, 1.5rem)', color: 'var(--ink)',
                  letterSpacing: '-0.01em',
                }}>
                  Encuentra la de tu equipo
                </h2>
              </div>
              <Link href="/productos" style={{
                fontFamily: 'var(--font-display)', fontWeight: 600,
                fontSize: '0.82rem', color: 'var(--ink)',
                textDecoration: 'none', borderBottom: '1.5px solid var(--ink)', paddingBottom: 2,
              }}>
                Ver todas →
              </Link>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: 10,
            }}>
              {ligasConInventario.map(c => (
                <Link key={c.label} href={c.href} style={{ textDecoration: 'none' }} className="category-card">
                  <div style={{
                    background: 'var(--surface)', border: '1px solid var(--line)',
                    borderRadius: 12, padding: '14px 14px',
                    display: 'flex', alignItems: 'center', gap: 10,
                    cursor: 'pointer',
                  }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 8,
                      background: 'var(--surface-alt)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.1rem', flexShrink: 0,
                    }}>
                      {c.emoji}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p style={{
                        fontWeight: 600, fontSize: '0.85rem', color: 'var(--ink)',
                        lineHeight: 1.2,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {c.label}
                      </p>
                      <p style={{ fontSize: '0.68rem', color: 'var(--muted)', marginTop: 2 }}>
                        {c.count} {c.count === 1 ? 'artículo' : 'artículos'}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* BANNER PUBLICITARIO EDITABLE */}
      {banner.activo && (
        <section style={{ padding: '24px 0', background: 'var(--bg)' }}>
          <div className="container-wide">
            <div style={{
              background: banner.color_fondo || '#0B0B0B',
              borderRadius: 18,
              padding: 'clamp(24px, 3.5vw, 40px)',
              color: banner.color_texto || '#fff',
              display: 'grid',
              gridTemplateColumns: banner.imagen ? '1fr 200px' : '1fr auto',
              alignItems: 'center',
              gap: 28,
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{ position: 'relative', zIndex: 2, maxWidth: 600 }}>
                <p style={{
                  fontSize: '0.68rem', opacity: 0.7, marginBottom: 8,
                  letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600,
                }}>
                  Publicidad
                </p>
                {banner.subtitulo && (
                  <p style={{
                    fontSize: '0.78rem', opacity: 0.85, marginBottom: 10,
                  }}>
                    {banner.subtitulo}
                  </p>
                )}
                <h3 style={{
                  fontFamily: 'var(--font-display)', fontWeight: 800,
                  fontSize: 'clamp(1.6rem, 3.4vw, 2.4rem)', lineHeight: 1.04,
                  letterSpacing: '-0.02em', marginBottom: 8,
                }}>
                  {banner.titulo}
                </h3>
                {banner.precio_o_oferta && (
                  <p style={{
                    fontWeight: 600, fontSize: '1rem', marginBottom: 18,
                    color: banner.color_acento || '#FFE066',
                  }}>
                    {banner.precio_o_oferta}
                  </p>
                )}
                <a
                  href={banner.href || '#'}
                  target={banner.href?.startsWith('http') ? '_blank' : '_self'}
                  rel="noreferrer"
                  style={{ textDecoration: 'none' }}
                >
                  <button style={{
                    background: banner.color_texto || '#fff',
                    color: banner.color_fondo || 'var(--ink)',
                    padding: '11px 22px', borderRadius: 999,
                    border: 'none', cursor: 'pointer',
                    fontWeight: 600, fontSize: '0.88rem',
                  }}>
                    {banner.cta || 'Ver más'} →
                  </button>
                </a>
              </div>

              <div style={{
                position: 'relative', width: banner.imagen ? 200 : 140,
                height: banner.imagen ? 160 : 140, flexShrink: 0,
              }} className="hidden md:block">
                {banner.imagen ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={banner.imagen}
                    alt={banner.titulo}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                ) : (
                  <>
                    <div style={{
                      position: 'absolute', inset: 0,
                      borderRadius: '50%',
                      background: `radial-gradient(circle at 30% 30%, ${banner.color_acento || '#FFE066'}44, transparent 60%)`,
                    }} />
                    <div style={{
                      position: 'absolute', inset: 20,
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '3.5rem',
                    }}>
                      📣
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* PRODUCTOS DESTACADOS */}
      <section style={{ padding: '40px 0 64px', background: 'var(--bg)' }}>
        <div className="container-wide">
          <div style={{
            display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
            marginBottom: 24, flexWrap: 'wrap', gap: 12,
          }}>
            <div>
              <p style={{ color: 'var(--muted)', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
                Nuevas camisetas
              </p>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontWeight: 700,
                fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)', color: 'var(--ink)',
                letterSpacing: '-0.01em',
              }}>
                Lo más nuevo de la temporada
              </h2>
            </div>
            <Link href="/productos" style={{
              fontFamily: 'var(--font-display)', fontWeight: 600,
              fontSize: '0.82rem', color: 'var(--ink)',
              textDecoration: 'none', borderBottom: '1.5px solid var(--ink)', paddingBottom: 2,
            }}>
              Ver catálogo completo →
            </Link>
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            style={{ gap: 20 }}
          >
            {destacados.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* BENEFICIOS — pie de página del home, antes del CTA */}
      <section style={{
        padding: '40px 0', background: 'var(--surface)',
        borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)',
      }}>
        <div className="container-wide">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 24,
          }}>
            {[
              { icon: '💵', title: 'Pago contra entrega', desc: 'Paga solo cuando recibes tu pedido.' },
              { icon: '📦', title: 'Envíos a toda Colombia', desc: '2 a 5 días hábiles según ciudad.' },
              { icon: '⭐', title: 'Productos oficiales', desc: 'Alta calidad, oficiales y réplicas premium.' },
              { icon: '💬', title: 'Atención WhatsApp', desc: 'Lunes a sábado, 8am a 8pm.' },
            ].map(b => (
              <div key={b.title} style={{ display: 'flex', gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: 'var(--surface-alt)', border: '1px solid var(--line)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.15rem', flexShrink: 0,
                }}>
                  {b.icon}
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--ink)', marginBottom: 2 }}>
                    {b.title}
                  </p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.45 }}>
                    {b.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA WHATSAPP */}
      <section style={{ padding: '64px 0', background: 'var(--bg)' }}>
        <div className="container-wide" style={{ maxWidth: 720, textAlign: 'center' }}>
          <p style={{
            fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.15em',
            textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10,
          }}>
            ¿Dudas sobre tallas, precios o envíos?
          </p>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', color: 'var(--ink)',
            letterSpacing: '-0.02em', lineHeight: 1.05, marginBottom: 14,
          }}
          className="text-balance">
            Escríbenos sin compromiso
          </h2>
          <p style={{
            fontSize: '0.95rem', color: 'var(--muted)', lineHeight: 1.55,
            marginBottom: 28, maxWidth: 500, margin: '0 auto 28px',
          }}>
            Respondemos rápido. Pago contra entrega en toda Colombia.
          </p>
          <a
            href="https://wa.me/573174721539?text=Hola%20Lucasports!%20Quiero%20info%20sobre%20las%20camisetas"
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <button className="btn-whatsapp" style={{ padding: '14px 34px', fontSize: '0.95rem' }}>
              💬 Abrir WhatsApp — 317 472 1539
            </button>
          </a>
        </div>
      </section>
    </>
  );
}
