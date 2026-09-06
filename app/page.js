import Image from 'next/image';
import Link from 'next/link';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ProductCard from '@/components/ProductCard';

async function getProductos() {
  try {
    const q = query(collection(db, 'productos'), limit(5));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const productos = await getProductos();

  return (
    <div style={{ paddingTop: 64 }}>

     {/* ═══════════════════════ HERO REDISEÑADO (PASO 4) ═══════════════════════ */}
<section style={{ backgroundColor: 'var(--surface)', padding: '60px 0 80px 0' }}>
  <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
    
    {/* Columna Izquierda: Textos y CTA */}
    <div>
      <h1 style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: 'clamp(3rem, 7vw, 5.5rem)',
        fontWeight: 700,
        lineHeight: 0.95,
        color: 'var(--ink)',
        letterSpacing: '-0.03em',
        marginBottom: 20
      }}>
        TEMPORADA 26/27
      </h1>
      
      <p style={{
        color: 'var(--muted)',
        fontSize: '1.2rem',
        lineHeight: 1.6,
        marginBottom: 32,
        maxWidth: 480
      }}>
        Camisetas oficiales de las grandes ligas.
      </p>

      <Link href="/productos">
        <button className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          IR A LA TIENDA →
        </button>
      </Link>
    </div>

    {/* Columna Derecha: Composición de 2 imágenes */}
    <div className="grid grid-cols-12 gap-4 items-center">
      {/* Imagen Principal (Vertical) */}
      <div className="col-span-7 relative rounded-2xl overflow-hidden" style={{ height: 420, backgroundColor: 'var(--bg)' }}>
        <span style={{
          position: 'absolute',
          top: 16,
          left: 16,
          backgroundColor: 'var(--season)',
          color: '#FFFFFF',
          fontSize: '0.75rem',
          fontWeight: 700,
          padding: '4px 12px',
          borderRadius: 999,
          zIndex: 10,
          letterSpacing: '0.05em'
        }}>
          NUEVO
        </span>
        
        <img
          src={productos[0]?.imageUrls?.[0] || productos[0]?.imageUrl || '/placeholder.jpg'}
          alt={productos[0]?.nombre || 'Camiseta 1'}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Imagen Secundaria (Cuadrada) */}
      <div className="col-span-5 rounded-2xl overflow-hidden" style={{ height: 280, backgroundColor: 'var(--bg)' }}>
        <img
          src={productos[1]?.imageUrls?.[0] || productos[1]?.imageUrl || '/placeholder.jpg'}
          alt={productos[1]?.nombre || 'Camiseta 2'}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    </div>

  </div>
</section>

      {/* ═══════════════════════ GARANTÍAS ═══════════════════════ */}
      <section style={{ background: 'var(--bg)', padding: '50px 0', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: '💵', title: 'Contra Entrega', desc: 'Pagas solo al recibir' },
            { icon: '📦', title: 'Envío Nacional', desc: 'Llegamos a toda Colombia' },
            { icon: '👕', title: 'Oficial & Réplica', desc: 'Camisetas de alta calidad' },
            { icon: '💬', title: 'Atención WhatsApp', desc: 'Respuesta rápida garantizada' },
          ].map(g => (
            <div key={g.title} style={{ padding: '20px 10px' }}>
              <p style={{ fontSize: '2.2rem', marginBottom: 8 }}>{g.icon}</p>
              <p style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'var(--ink)', fontSize: '1rem', fontWeight: 700, marginBottom: 4 }}>
                {g.title}
              </p>
              <p style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>{g.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════ PRODUCTOS DESTACADOS ═══════════════════════ */}
      <section style={{ padding: '80px 0' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div style={{ marginBottom: 48, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <p style={{ color: 'var(--season)', fontWeight: 700, letterSpacing: '0.15em', fontSize: '0.8rem', marginBottom: 6 }}>
                TEMPORADA 26/27
              </p>
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--ink)', fontWeight: 700, lineHeight: 0.95 }}>
                NUEVAS CAMISETAS
              </h2>
            </div>
            <Link href="/productos"
              style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'var(--ink)', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none', borderBottom: '2px solid var(--ink)', paddingBottom: 2 }}>
              VER TODOS →
            </Link>
          </div>

          {productos.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { nombre: 'Camiseta Real Madrid Local 26/27', categoria: 'LaLiga', descripcion: 'Camiseta oficial versión local temporada 26/27.', especial: 'NUEVO' },
                { nombre: 'Camiseta Arsenal Local 26/27', categoria: 'Premier League', descripcion: 'Camiseta oficial versión local Premier League.' },
                { nombre: 'Camiseta Conmemorativa Retro 90s', categoria: 'Retro', descripcion: 'Edición especial clásica para coleccionistas.', especial: 'EDICIÓN LIMITADA' },
              ].map((p, i) => (
                <div key={i} className="card-producto" style={{ padding: 0, borderRadius: 12 }}>
                  <div style={{ height: 260, background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <span style={{ fontSize: '6rem' }}>👕</span>
                    {p.especial && (
                      <span style={{ position: 'absolute', top: 12, right: 12, background: 'var(--season)', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: 999 }}>
                        {p.especial}
                      </span>
                    )}
                  </div>
                  <div style={{ padding: '18px 16px' }}>
                    <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'var(--ink)', fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>{p.nombre}</h3>
                    <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: 14 }}>{p.descripcion}</p>
                    <a href="https://wa.me/573174721539?text=Hola!%20Me%20interesa%20la%20camiseta" target="_blank">
                      <button className="btn-secondary" style={{ width: '100%', padding: '10px' }}>
                        💬 CONSULTAR PRECIO
                      </button>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {productos.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════ PASO 5: BANNER SMART WEARABLE ═══════════════════════ */}
      <section style={{
        background: '#0B1B3A',
        padding: '32px 40px',
        borderRadius: 12,
        margin: '48px auto',
        maxWidth: 1200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div>
          <p style={{ fontSize: '.8rem', opacity: .7, marginBottom: 8 }}>Mejor oferta online en camisetas de club</p>
          <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', lineHeight: 1 }}>
            TEMPORADA 26/27.
          </h3>
          <p style={{ marginTop: 6, fontWeight: 600 }}>HASTA 30% OFF EN PREVENTA</p>
        </div>
        
        <img src="/banner-jersey.png" alt="" style={{ height: 140, objectFit: 'contain' }} />

        <button aria-label="prev" style={{
          position: 'absolute',
          left: 12,
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(255, 255, 255, .15)',
          border: 'none',
          color: '#fff',
          width: 36,
          height: 36,
          borderRadius: '50%',
          cursor: 'pointer'
        }}>‹</button>

        <button aria-label="next" style={{
          position: 'absolute',
          right: 12,
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(255, 255, 255, .15)',
          border: 'none',
          color: '#fff',
          width: 36,
          height: 36,
          borderRadius: '50%',
          cursor: 'pointer'
        }}>›</button>
      </section>

      {/* ═══════════════════════ CTA WHATSAPP ═══════════════════════ */}
      <section style={{ background: 'var(--surface)', padding: '70px 0', borderTop: '1px solid var(--line)' }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p style={{ color: 'var(--muted)', fontWeight: 600, letterSpacing: '0.15em', fontSize: '0.85rem', marginBottom: 12 }}>
            ¿DUDAS SOBRE TALLAS, PRECIOS O ENVÍOS?
          </p>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--ink)', fontWeight: 700, marginBottom: 14 }}>
            ESCRÍBENOS SIN COMPROMISO
          </h2>
          <p style={{ color: 'var(--muted)', marginBottom: 36, fontSize: '1rem', lineHeight: 1.7 }}>
            Respondemos rápido · Pago contra entrega · Envíos a toda Colombia<br />
            <strong style={{ color: 'var(--ink)' }}>El cliente asume el costo del envío</strong>
          </p>
          <a href="https://wa.me/573174721539?text=Hola%20Luca'Sports!%20Quiero%20información%20sobre%20las%20camisetas%20🇨🇴" target="_blank">
            <button className="btn-primary" style={{ backgroundColor: 'var(--accent-2)', padding: '18px 56px' }}>
              💬 ABRIR WHATSAPP — 317 472 1539
            </button>
          </a>
        </div>
      </section>

    </div>
  );
}