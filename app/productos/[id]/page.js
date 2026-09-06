'use client';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, MessageCircle, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const WA = '573174721539';
const TALLAS = ['S', 'M', 'L', 'XL', 'XXL'];

export default function ProductoDetallePage({ params }) {
  const { id } = params;
  const [producto, setProducto] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [fotoActual, setFotoActual] = useState(0);
  const [talla, setTalla]       = useState('');
  const [added, setAdded]       = useState(false);
  const [error, setError]       = useState('');
  const { addToCart }           = useCart();

  useEffect(() => {
    const fetch = async () => {
      try {
        const snap = await getDoc(doc(db, 'productos', id));
        if (snap.exists()) setProducto({ id: snap.id, ...snap.data() });
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, [id]);

  if (loading) return (
    <div style={{ paddingTop: 80, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8F9FA' }}>
      <div style={{ width: 44, height: 44, border: '3px solid #E5E7EB', borderTopColor: '#003893', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!producto) return (
    <div style={{ paddingTop: 80, minHeight: '100vh', textAlign: 'center', background: '#F8F9FA', paddingTop: 120 }}>
      <p style={{ fontSize: '3rem' }}>😕</p>
      <p style={{ color: '#6B7280', marginTop: 12 }}>Producto no encontrado</p>
      <Link href="/productos" style={{ color: '#003893', display: 'inline-block', marginTop: 16 }}>← Volver al catálogo</Link>
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
    const msg = `¡Hola Luca'Sports! 🇨🇴\n\nQuiero comprar:\n• *${producto.nombre}*\n• Talla: *${talla}*\n• Precio: ${precio}\n\n¿Confirman disponibilidad? Pago contra entrega 🙏`;
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div style={{ paddingTop: 67, minHeight: '100vh', background: '#F8F9FA' }}>

      {/* Breadcrumb */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E5E7EB', padding: '12px 0' }}>
        <div className="max-w-6xl mx-auto px-4" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link href="/" style={{ color: '#6B7280', fontSize: '0.8rem', textDecoration: 'none' }}>Inicio</Link>
          <span style={{ color: '#D1D5DB', fontSize: '0.8rem' }}>›</span>
          <Link href="/productos" style={{ color: '#6B7280', fontSize: '0.8rem', textDecoration: 'none' }}>Productos</Link>
          <span style={{ color: '#D1D5DB', fontSize: '0.8rem' }}>›</span>
          <span style={{ color: '#111827', fontSize: '0.8rem', fontWeight: 600 }}>{producto.nombre}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Botón volver */}
        <Link href="/productos" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#6B7280', fontSize: '0.85rem', textDecoration: 'none', marginBottom: 28, fontWeight: 600 }}>
          <ArrowLeft size={16} /> Volver al catálogo
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* ── Galería ── */}
          <div>
            {/* Foto principal */}
            <div style={{ background: '#fff', border: '1px solid #E5E7EB', aspectRatio: '1', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              {fotos.length > 0 ? (
                <>
                  <img src={fotos[fotoActual]} alt={producto.nombre}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {fotos.length > 1 && (
                    <>
                      <button onClick={() => setFotoActual(f => f === 0 ? fotos.length - 1 : f - 1)}
                        style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.9)', border: '1px solid #E5E7EB', borderRadius: '50%', width: 38, height: 38, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ChevronLeft size={18} color="#111827" />
                      </button>
                      <button onClick={() => setFotoActual(f => f === fotos.length - 1 ? 0 : f + 1)}
                        style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.9)', border: '1px solid #E5E7EB', borderRadius: '50%', width: 38, height: 38, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ChevronRight size={18} color="#111827" />
                      </button>
                    </>
                  )}
                  {/* Badges */}
                  {producto.categoria && (
                    <span style={{ position: 'absolute', top: 14, left: 14, background: '#003893', color: '#FCD116', fontFamily: 'Bebas Neue, sans-serif', fontSize: '0.72rem', letterSpacing: '0.12em', padding: '4px 12px' }}>
                      {producto.categoria}
                    </span>
                  )}
                  {producto.especial && (
                    <span style={{ position: 'absolute', top: 14, right: 14, background: '#CE1126', color: '#fff', fontFamily: 'Bebas Neue, sans-serif', fontSize: '0.72rem', letterSpacing: '0.1em', padding: '4px 12px' }}>
                      {producto.especial}
                    </span>
                  )}
                </>
              ) : (
                <div style={{ fontSize: '10rem', opacity: 0.15 }}>👕</div>
              )}
            </div>

            {/* Miniaturas */}
            {fotos.length > 1 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {fotos.map((url, i) => (
                  <button key={i} onClick={() => setFotoActual(i)}
                    style={{ width: 72, height: 72, border: `2px solid ${i === fotoActual ? '#003893' : '#E5E7EB'}`, overflow: 'hidden', background: '#fff', cursor: 'pointer', padding: 0, transition: 'border-color 0.2s' }}>
                    <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Info ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <p style={{ color: '#003893', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>
                {producto.categoria}
              </p>
              <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: '#111827', lineHeight: 0.95, marginBottom: 16 }}>
                {producto.nombre}
              </h1>
              <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2.8rem', color: '#003893', lineHeight: 1 }}>
                {producto.precio > 0
                  ? <>${producto.precio.toLocaleString('es-CO')}<span style={{ fontSize: '1rem', color: '#9CA3AF', marginLeft: 8, fontFamily: 'Barlow, sans-serif', fontWeight: 400 }}>COP</span></>
                  : <span style={{ fontSize: '1.3rem', color: '#9CA3AF' }}>Consultar precio</span>
                }
              </p>
            </div>

            {/* Descripción */}
            {producto.descripcion && (
              <div style={{ background: '#fff', border: '1px solid #E5E7EB', padding: '18px 20px' }}>
                <p style={{ color: '#4B5563', fontSize: '0.9rem', lineHeight: 1.75 }}>{producto.descripcion}</p>
              </div>
            )}

            {/* Selector tallas */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <p style={{ color: '#374151', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Talla {talla && <span style={{ color: '#003893' }}>— {talla} seleccionada</span>}
                </p>
                <span style={{ color: '#9CA3AF', fontSize: '0.75rem' }}>¿Dudas de tu talla? Escríbenos</span>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {tallas.map(t => (
                  <button key={t} onClick={() => setTalla(t)}
                    style={{
                      width: 48, height: 48,
                      border: `2px solid ${talla === t ? '#003893' : '#E5E7EB'}`,
                      background: talla === t ? '#003893' : '#fff',
                      color: talla === t ? '#FCD116' : '#374151',
                      fontFamily: 'Bebas Neue, sans-serif', fontSize: '0.9rem',
                      cursor: 'pointer', fontWeight: talla === t ? 700 : 400,
                      transition: 'all 0.15s',
                    }}>
                    {t}
                  </button>
                ))}
              </div>
              {error && <p style={{ color: '#CE1126', fontSize: '0.8rem', marginTop: 8 }}>⚠️ {error}</p>}
            </div>

            {/* Garantías */}
            <div style={{ background: '#F0F9FF', border: '1px solid #BAE6FD', padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {['💵 Pago contra entrega — pagas al recibir', '📦 Envíos a toda Colombia', '✅ Producto oficial de alta calidad'].map(g => (
                <p key={g} style={{ color: '#0369A1', fontSize: '0.82rem' }}>{g}</p>
              ))}
            </div>

            {/* Botones */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button onClick={handleAdd}
                style={{
                  padding: '16px', background: added ? '#003893' : '#FCD116',
                  color: added ? '#FCD116' : '#000',
                  fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.1rem',
                  letterSpacing: '0.12em', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  transition: 'all 0.3s',
                }}>
                <ShoppingCart size={18} />
                {added ? '✓ AGREGADO AL CARRITO' : 'AGREGAR AL CARRITO'}
              </button>
              <button onClick={handleWA}
                style={{
                  padding: '16px', background: '#25D366', color: '#fff',
                  fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.1rem',
                  letterSpacing: '0.12em', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}>
                <MessageCircle size={18} /> PEDIR POR WHATSAPP
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
