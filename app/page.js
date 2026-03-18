import Link from 'next/link';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ProductCard from '@/components/ProductCard';

async function getProductosDestacados() {
  try {
    const q = query(collection(db, 'productos'), limit(4));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    return [];
  }
}

export default async function HomePage() {
  const productos = await getProductosDestacados();

  return (
    <div style={{ paddingTop: 64 }}>
      
      {/* HERO */}
      <section style={{
        background: 'linear-gradient(135deg, #003893 0%, #001a4d 50%, #0A0A0A 100%)',
        minHeight: '90vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden'
      }}>
        {/* Decorativo */}
        <div style={{
          position: 'absolute', right: '-5%', top: '50%', transform: 'translateY(-50%)',
          width: '55%', height: '130%', background: 'rgba(252,209,22,0.04)',
          borderRadius: '50%', border: '1px solid rgba(252,209,22,0.08)'
        }} />
        <div style={{
          position: 'absolute', right: '5%', top: '50%', transform: 'translateY(-50%)',
          width: '40%', height: '110%', background: 'rgba(206,17,38,0.03)',
          borderRadius: '50%', border: '1px solid rgba(206,17,38,0.06)'
        }} />

        <div className="max-w-7xl mx-auto px-4 w-full">
          <div style={{ maxWidth: 650 }}>
            <div className="animate-fade-up" style={{ animationDelay: '0.1s', opacity: 0, animationFillMode: 'forwards' }}>
              <span style={{
                background: '#FCD116', color: '#000',
                fontFamily: 'Bebas Neue, sans-serif', fontSize: '0.85rem',
                letterSpacing: '0.25em', padding: '4px 16px', display: 'inline-block', marginBottom: 24
              }}>
                NUEVA COLECCIÓN 2025
              </span>
            </div>
            <h1 className="animate-fade-up" style={{
              fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(3.5rem, 10vw, 7rem)',
              lineHeight: 0.9, color: '#fff', animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards'
            }}>
              VISTE LOS<br />
              <span style={{ color: '#FCD116' }}>COLORES</span><br />
              DE COLOMBIA
            </h1>
            <p className="animate-fade-up" style={{
              color: '#aaa', fontSize: '1.1rem', lineHeight: 1.7, marginTop: 24, marginBottom: 36,
              animationDelay: '0.35s', opacity: 0, animationFillMode: 'forwards'
            }}>
              Camisetas oficiales y réplicas de la Selección Colombia. La mejor calidad, el mejor precio. Envíos a todo el país.
            </p>
            <div className="animate-fade-up flex gap-4 flex-wrap" style={{ animationDelay: '0.5s', opacity: 0, animationFillMode: 'forwards' }}>
              <Link href="/productos">
                <button style={{
                  background: '#FCD116', color: '#000',
                  fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.1rem',
                  letterSpacing: '0.15em', padding: '16px 40px', border: 'none', cursor: 'pointer',
                  transition: 'all 0.3s'
                }}>
                  VER PRODUCTOS →
                </button>
              </Link>
              <a href="https://wa.me/573000000000" target="_blank">
                <button style={{
                  background: 'transparent', color: '#FCD116',
                  fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.1rem',
                  letterSpacing: '0.15em', padding: '16px 40px',
                  border: '2px solid #FCD116', cursor: 'pointer', transition: 'all 0.3s'
                }}>
                  WHATSAPP
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* BANDAS TRICOLOR */}
      <div style={{ display: 'flex', height: 8 }}>
        <div style={{ flex: 4, background: '#FCD116' }} />
        <div style={{ flex: 2, background: '#003893' }} />
        <div style={{ flex: 2, background: '#CE1126' }} />
      </div>

      {/* STATS */}
      <section style={{ background: '#0d0d0d', padding: '40px 0' }}>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { num: '500+', label: 'Clientes felices' },
            { num: '100%', label: 'Calidad garantizada' },
            { num: '24h', label: 'Respuesta rápida' },
            { num: '🇨🇴', label: 'Orgullo colombiano' },
          ].map(s => (
            <div key={s.label}>
              <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2.5rem', color: '#FCD116' }}>{s.num}</p>
              <p style={{ color: '#666', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCTOS DESTACADOS */}
      {productos.length > 0 && (
        <section style={{ padding: '80px 0' }}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <div>
                <p style={{ color: '#FCD116', fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.2em', fontSize: '0.9rem', marginBottom: 4 }}>
                  DESTACADOS
                </p>
                <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2.8rem', color: '#fff', lineHeight: 1 }}>
                  NUESTROS PRODUCTOS
                </h2>
              </div>
              <Link href="/productos" style={{ color: '#FCD116', fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.1em', fontSize: '0.95rem' }}>
                VER TODOS →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {productos.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* CTA WHATSAPP */}
      <section style={{ background: 'linear-gradient(90deg, #003893, #001a4d)', padding: '60px 0' }}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '0.9rem', color: '#FCD11688', letterSpacing: '0.25em', marginBottom: 12 }}>
            ¿TIENES DUDAS?
          </p>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#fff', marginBottom: 16 }}>
            ESCRÍBENOS POR WHATSAPP
          </h2>
          <p style={{ color: '#aaa', marginBottom: 32 }}>Atención personalizada · Envíos a todo Colombia · Pago contra entrega</p>
          <a href="https://wa.me/573000000000?text=Hola!%20Quiero%20pedir%20una%20camiseta" target="_blank">
            <button style={{
              background: '#25D366', color: '#fff',
              fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.1rem',
              letterSpacing: '0.15em', padding: '16px 48px', border: 'none', cursor: 'pointer'
            }}>
              💬 ABRIR WHATSAPP
            </button>
          </a>
        </div>
      </section>
    </div>
  );
}