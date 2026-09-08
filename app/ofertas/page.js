import Link from 'next/link';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ProductCard from '@/components/ProductCard';

// Sin cache: siempre trae la data fresca
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Un producto se considera "en oferta" si su badge especial contiene:
// OFERTA, DESCUENTO, PROMO, LIQUIDACIÓN, LIQUIDACION, o si tiene "precioAnterior" > precio
const BADGES_OFERTA = ['OFERTA', 'DESCUENTO', 'PROMO', 'LIQUIDACION', 'LIQUIDACIÓN', 'REBAJA'];

function estaEnOferta(p) {
  const badge = (p.especial || '').toString().toUpperCase().trim();
  if (BADGES_OFERTA.some(b => badge.includes(b))) return true;
  if (p.precioAnterior && Number(p.precioAnterior) > Number(p.precio)) return true;
  return false;
}

async function getProductos() {
  try {
    const snapshot = await getDocs(collection(db, 'productos'));
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch {
    return [];
  }
}

export default async function OfertasPage() {
  const productos = await getProductos();
  const ofertas = productos.filter(estaEnOferta);

  return (
    <>
      {/* HEADER */}
      <section style={{
        background: 'linear-gradient(135deg, #FF3B30 0%, #C81E1E 100%)',
        color: '#fff',
        paddingTop: 130,
        paddingBottom: 60,
      }}>
        <div className="container-wide">
          <p style={{
            fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.15em',
            textTransform: 'uppercase', opacity: 0.9, marginBottom: 10,
          }}>
            🔥 Precios especiales
          </p>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '-0.02em',
            lineHeight: 1.05, marginBottom: 12,
          }}>
            Ofertas Lucasports
          </h1>
          <p style={{ fontSize: '1rem', opacity: 0.95, maxWidth: 640, lineHeight: 1.55 }}>
            Aquí encuentras todas las camisetas con descuento, preventas y promociones activas.
            Cambian frecuentemente — mientras haya inventario.
          </p>
        </div>
      </section>

      {/* CONTENIDO */}
      <section style={{ padding: '48px 0 80px', background: 'var(--bg)' }}>
        <div className="container-wide">

          {ofertas.length === 0 ? (
            <div style={{
              background: 'var(--surface)', border: '1px dashed var(--line-strong)',
              borderRadius: 16, padding: '56px 24px', textAlign: 'center',
            }}>
              <div style={{
                fontSize: '3rem', marginBottom: 14, opacity: 0.7,
              }}>
                🛒
              </div>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontWeight: 700,
                fontSize: '1.4rem', color: 'var(--ink)', marginBottom: 8,
              }}>
                No hay ofertas activas por ahora
              </h2>
              <p style={{
                color: 'var(--muted)', fontSize: '0.95rem', maxWidth: 500,
                margin: '0 auto 24px', lineHeight: 1.55,
              }}>
                Vuelve pronto o contáctanos por WhatsApp para conocer las próximas promociones.
                También puedes explorar el catálogo completo.
              </p>
              <div style={{ display: 'inline-flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Link href="/productos" className="btn-primary" style={{ padding: '12px 22px' }}>
                  Ver catálogo completo →
                </Link>
                <a
                  href="https://wa.me/573174721539?text=Hola%20Lucasports!%20Quiero%20saber%20si%20hay%20ofertas%20disponibles"
                  target="_blank" rel="noreferrer"
                  className="btn-whatsapp"
                  style={{ padding: '12px 22px' }}
                >
                  💬 Preguntar por WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <>
              <div style={{
                display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
                marginBottom: 24, flexWrap: 'wrap', gap: 12,
              }}>
                <div>
                  <p style={{
                    color: 'var(--muted)', fontSize: '0.72rem', fontWeight: 600,
                    letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4,
                  }}>
                    {ofertas.length} {ofertas.length === 1 ? 'producto en oferta' : 'productos en oferta'}
                  </p>
                  <h2 style={{
                    fontFamily: 'var(--font-display)', fontWeight: 700,
                    fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)', color: 'var(--ink)',
                    letterSpacing: '-0.01em',
                  }}>
                    Aprovecha antes de que se agoten
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
                {ofertas.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            </>
          )}

          {/* Nota informativa */}
          <div style={{
            marginTop: 40, padding: '20px 24px',
            background: 'var(--surface)', border: '1px solid var(--line)',
            borderRadius: 12,
          }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.55 }}>
              💡 <strong style={{ color: 'var(--ink)' }}>Cómo funciona:</strong> Un producto
              aparece aquí automáticamente cuando el administrador le pone la etiqueta especial
              <strong style={{ color: 'var(--ink)' }}> "OFERTA"</strong> (o similares como
              PROMO, DESCUENTO, REBAJA) desde el panel de admin.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
