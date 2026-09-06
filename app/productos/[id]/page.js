'use client';
import { use, useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, MessageCircle, ChevronLeft, ChevronRight, ArrowLeft, Heart, Truck, ShieldCheck, CreditCard } from 'lucide-react';
import Link from 'next/link';

const WA = '573174721539';
const TALLAS = ['S', 'M', 'L', 'XL', 'XXL'];

export default function ProductoDetallePage({ params }) {
  // Next 15/16: params es Promise, usar `use()`
  const { id } = use(params);
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fotoActual, setFotoActual] = useState(0);
  const [talla, setTalla] = useState('');
  const [added, setAdded] = useState(false);
  const [error, setError] = useState('');
  const [liked, setLiked] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, 'productos', id));
        if (snap.exists()) setProducto({ id: snap.id, ...snap.data() });
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [id]);

  if (loading) return (
    <div style={{ paddingTop: 120, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div style={{ width: 40, height: 40, border: '3px solid var(--line)', borderTopColor: 'var(--ink)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    </div>
  );

  if (!producto) return (
    <div style={{ paddingTop: 140, minHeight: '100vh', textAlign: 'center', background: 'var(--bg)' }}>
      <p style={{ fontSize: '3rem' }}>😕</p>
      <p style={{ color: 'var(--muted)', marginTop: 12, fontSize: '0.95rem' }}>Producto no encontrado</p>
      <Link href="/productos" style={{ color: 'var(--ink)', display: 'inline-block', marginTop: 20, fontWeight: 600, borderBottom: '1.5px solid var(--ink)' }}>
        Volver al catálogo
      </Link>
    </div>
  );

  const fotos = producto.imageUrls?.length > 0 ? producto.imageUrls : producto.imageUrl ? [producto.imageUrl] : [];
  const tallas = producto.tallas?.length > 0 ? producto.tallas : TALLAS;

  const handleAdd = () => {
    if (!talla) { setError('Selecciona una talla'); setTimeout(() => setError(''), 2500); return; }
    addToCart(producto, talla);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const handleWA = () => {
    if (!talla) { setError('Selecciona una talla'); setTimeout(() => setError(''), 2500); return; }
    const precio = producto.precio > 0 ? `$${producto.precio.toLocaleString('es-CO')} COP` : 'precio a consultar';
    const msg = `¡Hola Lucasports!\n\nQuiero comprar:\n• ${producto.nombre}\n• Talla: ${talla}\n• Precio: ${precio}\n\n¿Confirman disponibilidad? Pago contra entrega 🙏`;
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div style={{ paddingTop: 90, minHeight: '100vh', background: 'var(--bg)' }}>

      {/* Breadcrumb */}
      <div className="container-wide" style={{ padding: '16px 24px 0' }}>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <Link href="/" style={{ color: 'var(--muted)', fontSize: '0.8rem', textDecoration: 'none' }}>Inicio</Link>
          <span style={{ color: 'var(--muted-2)' }}>/</span>
          <Link href="/productos" style={{ color: 'var(--muted)', fontSize: '0.8rem', textDecoration: 'none' }}>Tienda</Link>
          <span style={{ color: 'var(--muted-2)' }}>/</span>
          <span style={{ color: 'var(--ink)', fontSize: '0.8rem', fontWeight: 600 }}>{producto.nombre}</span>
        </nav>
      </div>

      <div className="container-wide" style={{ padding: '24px 24px 72px' }}>
        <Link href="/productos" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          color: 'var(--muted)', fontSize: '0.85rem', textDecoration: 'none',
          marginBottom: 24, fontWeight: 500,
        }}>
          <ArrowLeft size={14} /> Volver
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: 48 }}>

          {/* ── Galería ── */}
          <div>
            <div className="placeholder-jersey" style={{
              aspectRatio: '4/5', position: 'relative', overflow: 'hidden',
              borderRadius: 16, marginBottom: 12,
              border: '1px solid var(--line)',
            }}>
              {fotos.length > 0 ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={fotos[fotoActual]} alt={producto.nombre}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {fotos.length > 1 && (
                    <>
                      <button onClick={() => setFotoActual(f => f === 0 ? fotos.length - 1 : f - 1)}
                        aria-label="Anterior"
                        style={{
                          position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                          background: 'rgba(255,255,255,0.95)', border: 'none', borderRadius: '50%',
                          width: 40, height: 40, cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                        <ChevronLeft size={18} color="var(--ink)" />
                      </button>
                      <button onClick={() => setFotoActual(f => f === fotos.length - 1 ? 0 : f + 1)}
                        aria-label="Siguiente"
                        style={{
                          position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                          background: 'rgba(255,255,255,0.95)', border: 'none', borderRadius: '50%',
                          width: 40, height: 40, cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                        <ChevronRight size={18} color="var(--ink)" />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '9rem', opacity: 0.25 }}>👕</div>
                  <p style={{ marginTop: 12, color: 'var(--muted-2)', fontSize: '0.9rem', fontWeight: 500 }}>
                    Imagen próximamente
                  </p>
                </div>
              )}

              {(producto.liga || producto.categoria) && (
                <span style={{
                  position: 'absolute', top: 16, left: 16,
                  background: 'rgba(255,255,255,0.95)', color: 'var(--ink)',
                  fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.04em',
                  padding: '6px 12px', borderRadius: 999,
                }}>
                  {producto.liga || producto.categoria}
                </span>
              )}
              {producto.especial && (
                <span style={{
                  position: 'absolute', top: 16, right: 16,
                  background: 'var(--season)', color: '#fff',
                  fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.04em',
                  padding: '6px 12px', borderRadius: 999,
                }}>
                  {producto.especial}
                </span>
              )}
            </div>

            {fotos.length > 1 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {fotos.map((url, i) => (
                  <button key={i} onClick={() => setFotoActual(i)}
                    aria-label={`Foto ${i + 1}`}
                    style={{
                      width: 72, height: 72, borderRadius: 10,
                      border: `2px solid ${i === fotoActual ? 'var(--ink)' : 'var(--line)'}`,
                      overflow: 'hidden', background: 'var(--surface)',
                      cursor: 'pointer', padding: 0, transition: 'border-color 0.2s',
                    }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Info ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <p style={{
                color: 'var(--muted)', fontSize: '0.78rem', fontWeight: 600,
                letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10,
              }}>
                {producto.liga || producto.categoria || 'Temporada 26/27'}
              </p>
              <h1 style={{
                fontFamily: 'var(--font-display)', fontWeight: 800,
                fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', color: 'var(--ink)',
                letterSpacing: '-0.02em', lineHeight: 1.05, marginBottom: 20,
              }}>
                {producto.nombre}
              </h1>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <p style={{
                  fontFamily: 'var(--font-display)', fontWeight: 700,
                  fontSize: '2rem', color: 'var(--ink)',
                }}>
                  {producto.precio > 0
                    ? <>${producto.precio.toLocaleString('es-CO')}<span style={{ fontSize: '0.9rem', color: 'var(--muted)', marginLeft: 8, fontWeight: 400 }}>COP</span></>
                    : <span style={{ fontSize: '1.2rem', color: 'var(--muted)' }}>Consultar precio</span>
                  }
                </p>
              </div>
            </div>

            {producto.descripcion && (
              <p style={{
                color: 'var(--ink-soft)', fontSize: '0.95rem', lineHeight: 1.7,
              }}>
                {producto.descripcion}
              </p>
            )}

            {/* Tallas */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <p style={{ color: 'var(--ink)', fontSize: '0.85rem', fontWeight: 700 }}>
                  Selecciona talla {talla && <span style={{ color: 'var(--muted)', fontWeight: 500 }}>· {talla}</span>}
                </p>
                <a
                  href="https://wa.me/573174721539?text=Hola!%20Necesito%20ayuda%20con%20la%20talla"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: 'var(--muted)', fontSize: '0.78rem', textDecoration: 'underline' }}
                >
                  Guía de tallas
                </a>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {tallas.map(t => (
                  <button key={t} onClick={() => setTalla(t)}
                    style={{
                      minWidth: 52, height: 46, padding: '0 14px',
                      border: `1.5px solid ${talla === t ? 'var(--ink)' : 'var(--line)'}`,
                      background: talla === t ? 'var(--ink)' : 'var(--surface)',
                      color: talla === t ? '#fff' : 'var(--ink)',
                      fontSize: '0.9rem', fontWeight: 600,
                      cursor: 'pointer', borderRadius: 10,
                      transition: 'all 0.15s',
                    }}>
                    {t}
                  </button>
                ))}
              </div>
              {error && <p style={{ color: 'var(--season)', fontSize: '0.82rem', marginTop: 10 }}>⚠️ {error}</p>}
            </div>

            {/* Botones */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={handleAdd}
                style={{
                  flex: 1, padding: '16px 24px', borderRadius: 999,
                  background: added ? 'var(--whatsapp)' : 'var(--ink)',
                  color: '#fff',
                  fontSize: '0.95rem', fontWeight: 600,
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  transition: 'all 0.3s',
                }}>
                <ShoppingBag size={16} />
                {added ? '✓ Agregado al carrito' : 'Agregar al carrito'}
              </button>
              <button
                onClick={() => setLiked(l => !l)}
                aria-label="Favorito"
                style={{
                  width: 52, height: 52, borderRadius: '50%',
                  background: 'var(--surface)', border: '1.5px solid var(--line)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                <Heart size={18} color={liked ? 'var(--season)' : 'var(--ink)'} fill={liked ? 'var(--season)' : 'none'} />
              </button>
            </div>

            <button onClick={handleWA} className="btn-whatsapp" style={{ width: '100%', justifyContent: 'center', padding: '16px 24px' }}>
              <MessageCircle size={16} />
              Pedir por WhatsApp
            </button>

            {/* Beneficios */}
            <div style={{
              background: 'var(--surface)', border: '1px solid var(--line)',
              borderRadius: 14, padding: 20,
              display: 'flex', flexDirection: 'column', gap: 14,
            }}>
              {[
                { icon: CreditCard, title: 'Pago contra entrega', desc: 'Paga solo cuando recibes el pedido.' },
                { icon: Truck,      title: 'Envíos a toda Colombia', desc: 'Entre 2 y 5 días hábiles según la ciudad.' },
                { icon: ShieldCheck, title: 'Producto oficial', desc: 'Camisetas de alta calidad, garantizadas.' },
              ].map(b => (
                <div key={b.title} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: 'var(--surface-alt)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <b.icon size={16} color="var(--ink)" />
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--ink)', marginBottom: 2 }}>
                      {b.title}
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                      {b.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
