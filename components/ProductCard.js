'use client';
import { useState } from 'react';
import { ShoppingBag, MessageCircle, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

const TALLAS_DEFAULT = ['S', 'M', 'L', 'XL', 'XXL'];
const WA_NUMBER = '573174721539';

export default function ProductCard({ product }) {
  const [selectedSize, setSelectedSize] = useState('');
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);
  const [fotoActual, setFotoActual] = useState(0);
  const [liked, setLiked] = useState(false);
  const { addToCart } = useCart();

  const fotos = product.imageUrls?.length > 0
    ? product.imageUrls
    : product.imageUrl ? [product.imageUrl] : [];

  const stop = (e) => { e.preventDefault(); e.stopPropagation(); };
  const fotoAnterior = (e) => { stop(e); setFotoActual(p => p === 0 ? fotos.length - 1 : p - 1); };
  const fotoSiguiente = (e) => { stop(e); setFotoActual(p => p === fotos.length - 1 ? 0 : p + 1); };

  const handleAddToCart = () => {
    if (!selectedSize) { setError('Selecciona una talla'); setTimeout(() => setError(''), 2500); return; }
    addToCart(product, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const handleDirectWA = () => {
    if (!selectedSize) { setError('Selecciona una talla'); setTimeout(() => setError(''), 2500); return; }
    const precio = product.precio > 0 ? `$${product.precio.toLocaleString('es-CO')} COP` : 'precio a consultar';
    const mensaje = `¡Hola Lucasports!\n\nQuiero comprar:\n• ${product.nombre}\n• Talla: ${selectedSize}\n• Precio: ${precio}\n\n¿Me confirman disponibilidad? Pago contra entrega 🙏`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  const tallas = product.tallas?.length > 0 ? product.tallas : TALLAS_DEFAULT;

  return (
    <div className="card-producto">

      {/* ── Galería ── */}
      <Link href={`/productos/${product.id}`} style={{ textDecoration: 'none', display: 'block' }}>
        <div
          className="placeholder-jersey"
          style={{
            aspectRatio: '4/5',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {fotos.length > 0 ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={fotos[fotoActual]}
                alt={product.nombre}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {fotos.length > 1 && (
                <>
                  <button onClick={fotoAnterior} aria-label="Foto anterior"
                    style={{
                      position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
                      background: 'rgba(255,255,255,0.95)', border: 'none', borderRadius: '50%',
                      width: 32, height: 32, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2,
                    }}>
                    <ChevronLeft size={16} color="#0B0B0B" />
                  </button>
                  <button onClick={fotoSiguiente} aria-label="Siguiente foto"
                    style={{
                      position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                      background: 'rgba(255,255,255,0.95)', border: 'none', borderRadius: '50%',
                      width: 32, height: 32, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2,
                    }}>
                    <ChevronRight size={16} color="#0B0B0B" />
                  </button>
                  {/* Contador foto */}
                  <span style={{
                    position: 'absolute', bottom: 10, right: 10,
                    background: 'rgba(255,255,255,0.9)', color: 'var(--ink)',
                    fontSize: '0.68rem', padding: '3px 9px', borderRadius: 999,
                    fontWeight: 600,
                  }}>
                    {fotoActual + 1}/{fotos.length}
                  </span>
                </>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: 24 }}>
              <div style={{ fontSize: '4.5rem', opacity: 0.3 }}>👕</div>
              <p style={{ marginTop: 10, fontSize: '0.72rem', color: 'var(--muted-2)', fontWeight: 500 }}>
                Foto próximamente
              </p>
            </div>
          )}

          {/* Badge de liga (top-left) */}
          {(product.liga || product.categoria) && (
            <span style={{
              position: 'absolute', top: 12, left: 12,
              background: 'rgba(255,255,255,0.95)', color: 'var(--ink)',
              fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.04em',
              padding: '5px 10px', borderRadius: 999,
              backdropFilter: 'blur(4px)',
            }}>
              {product.liga || product.categoria}
            </span>
          )}

          {/* Badge especial (top-right, sobre corazón) */}
          {product.especial && (
            <span style={{
              position: 'absolute', top: 12, right: 52,
              background: 'var(--season)', color: '#fff',
              fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.04em',
              padding: '5px 10px', borderRadius: 999,
            }}>
              {product.especial}
            </span>
          )}

          {/* Like button */}
          <button
            onClick={(e) => { stop(e); setLiked(l => !l); }}
            aria-label="Favorito"
            style={{
              position: 'absolute', top: 10, right: 10,
              width: 34, height: 34, borderRadius: '50%',
              background: 'rgba(255,255,255,0.95)', border: 'none',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 2,
            }}>
            <Heart size={16} color={liked ? '#FF3B30' : '#0B0B0B'} fill={liked ? '#FF3B30' : 'none'} />
          </button>
        </div>
      </Link>

      {/* ── Info ── */}
      <div style={{ padding: '18px 18px 20px', display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>

        {/* Nombre + precio */}
        <Link href={`/productos/${product.id}`} style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
            <h3 style={{
              fontFamily: 'var(--font-display)', fontWeight: 600,
              fontSize: '0.98rem', color: 'var(--ink)',
              lineHeight: 1.3, letterSpacing: '-0.005em', flex: 1,
            }}>
              {product.nombre}
            </h3>
            <p style={{
              fontFamily: 'var(--font-display)', fontWeight: 700,
              fontSize: '1rem', color: 'var(--ink)', whiteSpace: 'nowrap',
            }}>
              {product.precio > 0
                ? `$${product.precio.toLocaleString('es-CO')}`
                : <span style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 500 }}>Consultar</span>
              }
            </p>
          </div>
          {product.descripcion && (
            <p style={{
              color: 'var(--muted)', fontSize: '0.82rem',
              lineHeight: 1.5, marginTop: 6,
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {product.descripcion}
            </p>
          )}
        </Link>

        {/* Selector tallas compacto */}
        <div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {tallas.map(t => (
              <button key={t} onClick={() => setSelectedSize(t)}
                style={{
                  minWidth: 34, height: 30, padding: '0 10px',
                  border: `1.5px solid ${selectedSize === t ? 'var(--ink)' : 'var(--line)'}`,
                  background: selectedSize === t ? 'var(--ink)' : 'var(--surface)',
                  color: selectedSize === t ? '#fff' : 'var(--ink)',
                  fontSize: '0.75rem', fontWeight: 600,
                  cursor: 'pointer', borderRadius: 8,
                  transition: 'all 0.15s',
                }}>
                {t}
              </button>
            ))}
          </div>
          {error && (
            <p style={{ color: 'var(--season)', fontSize: '0.75rem', marginTop: 8 }}>
              ⚠️ {error}
            </p>
          )}
        </div>

        {/* Botones */}
        <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
          <button onClick={handleAddToCart}
            style={{
              flex: 1, padding: '12px', borderRadius: 999,
              background: added ? 'var(--whatsapp)' : 'var(--ink)',
              color: '#fff',
              fontSize: '0.82rem', fontWeight: 600,
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              transition: 'all 0.3s',
            }}>
            <ShoppingBag size={14} />
            {added ? '✓ Agregado' : 'Agregar'}
          </button>
          <button onClick={handleDirectWA}
            aria-label="Pedir por WhatsApp"
            style={{
              width: 44, height: 44, padding: 0, borderRadius: '50%',
              background: 'var(--surface)', color: 'var(--whatsapp)',
              border: '1.5px solid var(--line)',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
              flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--whatsapp)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'var(--whatsapp)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.color = 'var(--whatsapp)'; e.currentTarget.style.borderColor = 'var(--line)'; }}
          >
            <MessageCircle size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
