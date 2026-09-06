import Link from 'next/link';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ProductCard from '@/components/ProductCard';
import HeroCarousel from '@/components/HeroCarousel';

async function getProductos(max = 6) {
  try {
    const q = query(collection(db, 'productos'), limit(max));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch {
    return [];
  }
}

const CATEGORIAS_HERO = [
  { label: 'Premier League', tag: 'PL', href: '/productos?cat=Premier%20League', img: '⚽' },
  { label: 'LaLiga',         tag: 'ES', href: '/productos?cat=LaLiga',         img: '🇪🇸' },
  { label: 'Serie A',        tag: 'IT', href: '/productos?cat=Serie%20A',      img: '🇮🇹' },
  { label: 'Bundesliga',     tag: 'DE', href: '/productos?cat=Bundesliga',     img: '🇩🇪' },
  { label: 'Ligue 1',        tag: 'FR', href: '/productos?cat=Ligue%201',      img: '🇫🇷' },
  { label: 'Selecciones',    tag: 'INT', href: '/productos?cat=Selecciones',   img: '🌍' },
];

// Productos placeholder para cuando Firebase esté vacío
const PLACEHOLDERS = [
  { id: 'ph-1', nombre: 'Camiseta Local Real Madrid 26/27', precio: 189000, categoria: 'LaLiga', liga: 'LaLiga', descripcion: 'La nueva camiseta local del Real Madrid para la temporada 26/27. Tela Dri-FIT.', destacado: true },
  { id: 'ph-2', nombre: 'Camiseta Visitante FC Barcelona 26/27', precio: 189000, categoria: 'LaLiga', liga: 'LaLiga', descripcion: 'Diseño visitante del FC Barcelona con detalles conmemorativos.' },
  { id: 'ph-3', nombre: 'Camiseta Local Manchester City 26/27', precio: 195000, categoria: 'Premier League', liga: 'Premier League', descripcion: 'La icónica camiseta celeste del City para la nueva temporada.', especial: 'NUEVO' },
  { id: 'ph-4', nombre: 'Camiseta Local Inter Miami 26/27', precio: 219000, categoria: 'MLS', liga: 'MLS', descripcion: 'La camiseta rosada del equipo de Messi. Preventa disponible.', especial: 'PREVENTA' },
  { id: 'ph-5', nombre: 'Camiseta Selección Argentina Home', precio: 179000, categoria: 'Selecciones', liga: 'Selecciones', descripcion: 'Tres estrellas sobre el pecho. Camiseta oficial de la Albiceleste.' },
  { id: 'ph-6', nombre: 'Camiseta Retro Brasil 1970', precio: 159000, categoria: 'Retro', liga: 'Retro', descripcion: 'Homenaje al Brasil de Pelé. Edición conmemorativa 100% algodón.', especial: 'RETRO' },
];

export default async function HomePage() {
  const productosFB = await getProductos(6);
  const productos = productosFB.length > 0 ? productosFB : PLACEHOLDERS;
  const heroProductos = productos.slice(0, 3);
  const destacados = productos.slice(0, 6);

  return (
    <>
      {/* ═══════════════════════════════════════
          HERO
          ═══════════════════════════════════════ */}
      <HeroCarousel productos={heroProductos} />

      {/* ═══════════════════════════════════════
          BARRA DE CATEGORÍAS / LIGAS
          ═══════════════════════════════════════ */}
      <section style={{ padding: '48px 0 24px', background: 'var(--bg)' }}>
        <div className="container-wide">
          <div style={{
            display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
            marginBottom: 24, flexWrap: 'wrap', gap: 12,
          }}>
            <div>
              <p style={{ color: 'var(--muted)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
                Explora por liga
              </p>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontWeight: 800,
                fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: 'var(--ink)',
                letterSpacing: '-0.02em',
              }}>
                Encuentra la de tu equipo
              </h2>
            </div>
            <Link href="/productos" style={{
              fontFamily: 'var(--font-display)', fontWeight: 600,
              fontSize: '0.88rem', color: 'var(--ink)',
              textDecoration: 'none', borderBottom: '1.5px solid var(--ink)', paddingBottom: 2,
            }}>
              Ver todas →
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 12,
          }}>
            {CATEGORIAS_HERO.map(c => (
              <Link key={c.label} href={c.href} style={{ textDecoration: 'none' }} className="category-card">
                <div style={{
                  background: 'var(--surface)', border: '1px solid var(--line)',
                  borderRadius: 14, padding: '18px 16px',
                  display: 'flex', alignItems: 'center', gap: 12,
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 10,
                    background: 'var(--surface-alt)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.3rem',
                  }}>
                    {c.img}
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--ink)', lineHeight: 1.2 }}>
                      {c.label}
                    </p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: 2 }}>
                      {c.tag}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          BANNER PROMOCIONAL (estilo referencia)
          ═══════════════════════════════════════ */}
      <section style={{ padding: '32px 0', background: 'var(--bg)' }}>
        <div className="container-wide">
          <div style={{
            background: 'linear-gradient(105deg, #0B1B3A 0%, #0d2350 60%, #1a3670 100%)',
            borderRadius: 20,
            padding: 'clamp(28px, 4vw, 44px)',
            color: '#fff',
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            alignItems: 'center',
            gap: 32,
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Contenido */}
            <div style={{ position: 'relative', zIndex: 2, maxWidth: 620 }}>
              <p style={{
                fontSize: '0.78rem', opacity: 0.75, marginBottom: 10,
                letterSpacing: '0.05em',
              }}>
                Mejor oferta online en camisetas de club
              </p>
              <h3 style={{
                fontFamily: 'var(--font-display)', fontWeight: 800,
                fontSize: 'clamp(1.9rem, 4vw, 2.8rem)', lineHeight: 1.02,
                letterSpacing: '-0.02em', marginBottom: 8,
              }}>
                TEMPORADA 26/27
              </h3>
              <p style={{
                fontWeight: 600, fontSize: '1.1rem', marginBottom: 20,
                color: '#FFE066',
              }}>
                Hasta 30% OFF en preventa
              </p>
              <Link href="/productos" style={{ textDecoration: 'none' }}>
                <button style={{
                  background: '#fff', color: 'var(--ink)',
                  padding: '12px 24px', borderRadius: 999,
                  border: 'none', cursor: 'pointer',
                  fontWeight: 600, fontSize: '0.9rem',
                }}>
                  Comprar ahora →
                </button>
              </Link>
            </div>

            {/* Decoración circular a la derecha */}
            <div style={{ position: 'relative', width: 180, height: 180, flexShrink: 0 }}
              className="hidden md:block">
              <div style={{
                position: 'absolute', inset: 0,
                borderRadius: '50%',
                background: 'radial-gradient(circle at 30% 30%, rgba(255,224,102,0.3), transparent 60%)',
              }} />
              <div style={{
                position: 'absolute', inset: 20,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '5rem',
              }}>
                👕
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          PRODUCTOS DESTACADOS
          ═══════════════════════════════════════ */}
      <section style={{ padding: '48px 0 72px', background: 'var(--bg)' }}>
        <div className="container-wide">
          <div style={{
            display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
            marginBottom: 32, flexWrap: 'wrap', gap: 12,
          }}>
            <div>
              <p style={{ color: 'var(--muted)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
                Nuevas camisetas
              </p>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontWeight: 800,
                fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', color: 'var(--ink)',
                letterSpacing: '-0.02em', lineHeight: 1.05,
              }}>
                Lo más nuevo de la temporada
              </h2>
            </div>
            <Link href="/productos" style={{
              fontFamily: 'var(--font-display)', fontWeight: 600,
              fontSize: '0.88rem', color: 'var(--ink)',
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

      {/* ═══════════════════════════════════════
          BENEFICIOS
          ═══════════════════════════════════════ */}
      <section style={{ padding: '48px 0', background: 'var(--surface)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div className="container-wide">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 32,
          }}>
            {[
              { icon: '💵', title: 'Pago contra entrega', desc: 'Paga solo cuando recibes tu pedido en casa.' },
              { icon: '📦', title: 'Envíos a toda Colombia', desc: 'Llegamos a cualquier ciudad en 2 a 5 días hábiles.' },
              { icon: '⭐', title: 'Productos oficiales', desc: 'Camisetas de alta calidad, oficiales y réplicas premium.' },
              { icon: '💬', title: 'Atención WhatsApp', desc: 'Respondemos rápido de lunes a sábado, 8am a 8pm.' },
            ].map(b => (
              <div key={b.title} style={{ display: 'flex', gap: 14 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: 'var(--surface-alt)', border: '1px solid var(--line)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.3rem', flexShrink: 0,
                }}>
                  {b.icon}
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--ink)', marginBottom: 4 }}>
                    {b.title}
                  </p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                    {b.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CTA WHATSAPP
          ═══════════════════════════════════════ */}
      <section style={{ padding: '80px 0', background: 'var(--bg)' }}>
        <div className="container-wide" style={{ maxWidth: 780, textAlign: 'center' }}>
          <p style={{
            fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.15em',
            textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12,
          }}>
            ¿Dudas sobre tallas, precios o envíos?
          </p>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', color: 'var(--ink)',
            letterSpacing: '-0.02em', lineHeight: 1.05, marginBottom: 16,
          }}
          className="text-balance">
            Escríbenos sin compromiso
          </h2>
          <p style={{
            fontSize: '1rem', color: 'var(--muted)', lineHeight: 1.6,
            marginBottom: 32, maxWidth: 520, margin: '0 auto 32px',
          }}>
            Respondemos rápido. Pago contra entrega en toda Colombia.
            El costo de envío lo asume el cliente y lo coordinamos por WhatsApp.
          </p>
          <a
            href="https://wa.me/573174721539?text=Hola%20Lucasports!%20Quiero%20info%20sobre%20las%20camisetas%2026%2F27"
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <button className="btn-whatsapp" style={{ padding: '16px 40px', fontSize: '1rem' }}>
              💬 Abrir WhatsApp — 317 472 1539
            </button>
          </a>
        </div>
      </section>
    </>
  );
}
