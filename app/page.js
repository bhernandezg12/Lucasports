import Image from 'next/image';
import Link from 'next/link';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ProductCard from '@/components/ProductCard';

async function getProductos() {
  try {
    const q = query(collection(db, 'productos'), limit(3));
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

      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <section style={{
        background: 'linear-gradient(135deg, #003893 0%, #001f5c 45%, #0A0A0A 100%)',
        minHeight: '75vh', display: 'flex', alignItems: 'center',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* Círculos decorativos de fondo */}
        <div style={{ position: 'absolute', right: '-8%', top: '50%', transform: 'translateY(-50%)', width: '55%', height: '130%', borderRadius: '50%', border: '1px solid rgba(252,209,22,0.07)', background: 'rgba(252,209,22,0.025)' }} />
        <div style={{ position: 'absolute', right: '4%', top: '50%', transform: 'translateY(-50%)', width: '38%', height: '110%', borderRadius: '50%', border: '1px solid rgba(252,209,22,0.05)', background: 'rgba(206,17,38,0.02)' }} />
        {/* Logo decorativo */}
<div style={{
  position: 'absolute', right: '8%', top: '50%',
  transform: 'translateY(-50%)',
  width: 300, height: 300,
  borderRadius: '50%',
  overflow: 'hidden',
  opacity: 0.12,
  userSelect: 'none',
  pointerEvents: 'none',
}}>
  {/* eslint-disable-next-line @next/next/no-img-element */}
  <img
    src="/logo.png"
    alt=""
    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
  />
</div>
        <div style={{ position: 'absolute', left: '2%', bottom: '10%', fontSize: '5rem', opacity: 0.06, userSelect: 'none' }}>🏆</div>

        <div className="max-w-7xl mx-auto px-4 w-full">
          <div style={{ maxWidth: 680 }}>
            {/* Badge */}
            <div className="animate-fade-up" style={{ animationDelay: '0.1s', opacity: 0, animationFillMode: 'forwards', marginBottom: 24 }}>
              <span style={{
                background: '#FCD116', color: '#000',
                fontFamily: 'Bebas Neue, sans-serif', fontSize: '0.8rem',
                letterSpacing: '0.3em', padding: '5px 18px', display: 'inline-block'
              }}>
                🇨🇴 RUMBO AL MUNDIAL 2026
              </span>
            </div>

            {/* Título */}
            <h1 className="animate-fade-up" style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 'clamp(3.8rem, 10vw, 7.5rem)',
              lineHeight: 0.88, color: '#fff',
              animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards'
            }}>
              VISTE LOS<br />
              <span style={{ color: '#FCD116' }}>COLORES</span><br />
              DE COLOMBIA
            </h1>

            {/* Subtítulo */}
            <p className="animate-fade-up" style={{
              color: '#8899bb', fontSize: '1.05rem', lineHeight: 1.75,
              marginTop: 24, marginBottom: 12,
              animationDelay: '0.33s', opacity: 0, animationFillMode: 'forwards'
            }}>
              Camisetas oficiales y conmemorativas de la Selección Colombia.<br />
              Desde <strong style={{ color: '#FCD116' }}>Manizales</strong> para todo el país 🇨🇴
            </p>

            {/* Íconos de garantía */}
            <div className="animate-fade-up" style={{
              display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 36,
              animationDelay: '0.4s', opacity: 0, animationFillMode: 'forwards'
            }}>
              {[
                { icon: '💵', text: 'Pago contra entrega' },
                { icon: '📦', text: 'Envíos a toda Colombia' },
                { icon: '✅', text: 'Productos oficiales' },
              ].map(g => (
                <div key={g.text} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: '1rem' }}>{g.icon}</span>
                  <span style={{ color: '#aaa', fontSize: '0.82rem' }}>{g.text}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="animate-fade-up" style={{
              display: 'flex', gap: 14, flexWrap: 'wrap',
              animationDelay: '0.5s', opacity: 0, animationFillMode: 'forwards'
            }}>
              <Link href="/productos">
                <button style={{
                  background: '#FCD116', color: '#000',
                  fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.1rem',
                  letterSpacing: '0.15em', padding: '16px 40px',
                  border: 'none', cursor: 'pointer', transition: 'all 0.3s'
                }}>
                  VER CATÁLOGO →
                </button>
              </Link>
              <a href="https://wa.me/573174721539?text=Hola%20Luca'Sports!%20Quiero%20ver%20los%20productos%20disponibles%20🇨🇴" target="_blank">
                <button style={{
                  background: '#25D366', color: '#fff',
                  fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.1rem',
                  letterSpacing: '0.12em', padding: '16px 36px',
                  border: 'none', cursor: 'pointer', transition: 'all 0.3s'
                }}>
                  💬 PEDIR POR WHATSAPP
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Banda tricolor */}
      <div style={{ display: 'flex', height: 7 }}>
        <div style={{ flex: 4, background: '#FCD116' }} />
        <div style={{ flex: 2, background: '#003893' }} />
        <div style={{ flex: 2, background: '#CE1126' }} />
      </div>

      {/* ═══════════════════════ GARANTÍAS ═══════════════════════ */}
      <section style={{ background: '#0c0c0c', padding: '50px 0' }}>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: '💵', title: 'Contra Entrega', desc: 'Pagas solo al recibir' },
            { icon: '📦', title: 'Envío Nacional', desc: 'Llegamos a toda Colombia' },
            { icon: '👕', title: 'Oficial & Réplica', desc: 'Camisetas de alta calidad' },
            { icon: '💬', title: 'Atención WhatsApp', desc: 'Respuesta rápida garantizada' },
          ].map(g => (
            <div key={g.title} style={{ padding: '20px 10px' }}>
              <p style={{ fontSize: '2.2rem', marginBottom: 8 }}>{g.icon}</p>
              <p style={{ fontFamily: 'Bebas Neue, sans-serif', color: '#FCD116', fontSize: '1rem', letterSpacing: '0.08em', marginBottom: 4 }}>
                {g.title}
              </p>
              <p style={{ color: '#555', fontSize: '0.8rem' }}>{g.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════ PRODUCTOS DESTACADOS ═══════════════════════ */}
      <section style={{ padding: '80px 0' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div style={{ marginBottom: 48, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <p style={{ color: '#FCD116', fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.25em', fontSize: '0.8rem', marginBottom: 6 }}>
                COLECCIÓN 2025 / 2026
              </p>
              <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#fff', lineHeight: 0.95 }}>
                NUESTROS<br /><span style={{ color: '#FCD116' }}>PRODUCTOS</span>
              </h2>
            </div>
            <Link href="/productos"
              style={{ fontFamily: 'Bebas Neue, sans-serif', color: '#FCD116', letterSpacing: '0.12em', fontSize: '0.9rem', textDecoration: 'none', border: '1px solid #FCD11655', padding: '8px 20px' }}>
              VER TODOS →
            </Link>
          </div>

          {productos.length === 0 ? (
            /* Tarjetas estáticas si Firebase no tiene datos aún */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { nombre: 'Camiseta Oficial Local Colombia 2026', precio: 0, categoria: 'Oficial', descripcion: 'La camiseta de la Selección Colombia para el Mundial 2026. Versión local.', especial: 'MUNDIAL 2026' },
                { nombre: 'Camiseta Entrenamiento Oficial Blanca', precio: 0, categoria: 'Entrenamiento', descripcion: 'Camiseta oficial de entrenamiento de la Selección Colombia. Color blanco.' },
                { nombre: 'Camiseta Conmemorativa 100 Años', precio: 0, categoria: 'Edición Especial', descripcion: 'Edición limitada conmemorativa por los 100 años de la Federación Colombiana de Fútbol.', especial: 'EDICIÓN LIMITADA' },
              ].map((p, i) => (
                <div key={i} className="card-producto" style={{ padding: 0 }}>
                  <div style={{ height: 260, background: 'linear-gradient(135deg, #1a1a1a, #0d1a2e)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <span style={{ fontSize: '6rem' }}>👕</span>
                    {p.especial && (
                      <span style={{ position: 'absolute', top: 12, right: 12, background: '#CE1126', color: '#fff', fontFamily: 'Bebas Neue, sans-serif', fontSize: '0.7rem', letterSpacing: '0.1em', padding: '3px 10px' }}>
                        {p.especial}
                      </span>
                    )}
                    <span style={{ position: 'absolute', top: 12, left: 12, background: '#003893', color: '#FCD116', fontFamily: 'Bebas Neue, sans-serif', fontSize: '0.7rem', letterSpacing: '0.1em', padding: '3px 10px' }}>
                      {p.categoria}
                    </span>
                  </div>
                  <div style={{ padding: '18px 16px' }}>
                    <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', color: '#fff', fontSize: '1.1rem', lineHeight: 1.2, marginBottom: 8 }}>{p.nombre}</h3>
                    <p style={{ color: '#666', fontSize: '0.8rem', lineHeight: 1.5, marginBottom: 14 }}>{p.descripcion}</p>
                    <a href="https://wa.me/573174721539?text=Hola!%20Me%20interesa%20la%20camiseta%20" target="_blank">
                      <button style={{ width: '100%', padding: '12px', background: '#25D366', color: '#fff', fontFamily: 'Bebas Neue, sans-serif', fontSize: '0.95rem', letterSpacing: '0.1em', border: 'none', cursor: 'pointer' }}>
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

      {/* ═══════════════════════ BANNER MUNDIAL ═══════════════════════ */}
      <section style={{ background: 'linear-gradient(90deg, #FCD116 0%, #f5c800 100%)', padding: '60px 0' }}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(2.5rem, 7vw, 5rem)', color: '#003893', lineHeight: 0.9, marginBottom: 16 }}>
            COLOMBIA AL MUNDIAL 2026 🏆
          </p>
          <p style={{ color: '#00286e', fontSize: '1rem', marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' }}>
            Luce los colores de la Tricolor con orgullo. Somos de Manizales y enviamos a toda Colombia.
          </p>
          <Link href="/productos">
            <button style={{ background: '#003893', color: '#FCD116', fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.1rem', letterSpacing: '0.15em', padding: '16px 48px', border: 'none', cursor: 'pointer' }}>
              VER CATÁLOGO COMPLETO →
            </button>
          </Link>
        </div>
      </section>

      {/* ═══════════════════════ CTA WHATSAPP ═══════════════════════ */}
      <section style={{ background: '#0A0A0A', padding: '70px 0' }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p style={{ fontFamily: 'Bebas Neue, sans-serif', color: '#FCD11666', letterSpacing: '0.25em', fontSize: '0.85rem', marginBottom: 12 }}>
            ¿DUDAS SOBRE TALLAS, PRECIOS O ENVÍOS?
          </p>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(2rem, 5vw, 4rem)', color: '#fff', marginBottom: 14 }}>
            ESCRÍBENOS SIN COMPROMISO
          </h2>
          <p style={{ color: '#555', marginBottom: 36, fontSize: '0.95rem', lineHeight: 1.7 }}>
            Respondemos rápido · Pago contra entrega · Envíos a toda Colombia<br />
            <strong style={{ color: '#FCD116' }}>El cliente asume el costo del envío</strong>
          </p>
          <a href="https://wa.me/573174721539?text=Hola%20Luca'Sports!%20Quiero%20información%20sobre%20las%20camisetas%20🇨🇴" target="_blank">
            <button style={{
              background: '#25D366', color: '#fff',
              fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.2rem',
              letterSpacing: '0.15em', padding: '18px 56px',
              border: 'none', cursor: 'pointer'
            }}>
              💬 ABRIR WHATSAPP — 317 472 1539
            </button>
          </a>
        </div>
      </section>

    </div>
  );
}
