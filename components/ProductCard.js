'use client';
import { useState } from 'react';
import { ShoppingCart, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const TALLAS_DEFAULT = ['S', 'M', 'L', 'XL', 'XXL'];
const WA_NUMBER = '573174721539';

export default function ProductCard({ product }) {
  const [selectedSize, setSelectedSize] = useState('');
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);
  const [fotoActual, setFotoActual] = useState(0);
  const { addToCart } = useCart();

  // Construir array de imágenes (soporta tanto imageUrls[] como imageUrl string)
  const fotos = product.imageUrls?.length > 0
    ? product.imageUrls
    : product.imageUrl
      ? [product.imageUrl]
      : [];

  const fotoAnterior = (e) => {
    e.stopPropagation();
    setFotoActual(prev => (prev === 0 ? fotos.length - 1 : prev - 1));
  };
  const fotoSiguiente = (e) => {
    e.stopPropagation();
    setFotoActual(prev => (prev === fotos.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = () => {
    if (!selectedSize) { setError('Selecciona una talla primero'); setTimeout(() => setError(''), 2500); return; }
    addToCart(product, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const handleDirectWA = () => {
    if (!selectedSize) { setError('Selecciona una talla primero'); setTimeout(() => setError(''), 2500); return; }
    const precio = product.precio > 0 ? `$${product.precio.toLocaleString('es-CO')} COP` : 'precio a consultar';
    const mensaje = `¡Hola Luca'Sports! 🇨🇴\n\nQuiero comprar:\n• *${product.nombre}*\n• Talla: *${selectedSize}*\n• Precio: ${precio}\n\n¿Me confirman disponibilidad? Pago contra entrega 🙏`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  const tallas = product.tallas?.length > 0 ? product.tallas : TALLAS_DEFAULT;

  return (
    <div className="card-producto group" style={{ display: 'flex', flexDirection: 'column' }}>

      {/* ── Galería de imágenes ── */}
      <div style={{ background: '#1a1a1a', height: 300, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

        {fotos.length > 0 ? (
          <>
            <img
              src={fotos[fotoActual]}
              alt={product.nombre}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.3s ease' }}
            />

            {/* Flechas de navegación — solo si hay más de 1 foto */}
            {fotos.length > 1 && (
              <>
                <button onClick={fotoAnterior}
                  style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                  <ChevronLeft size={18} color="#fff" />
                </button>
                <button onClick={fotoSiguiente}
                  style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                  <ChevronRight size={18} color="#fff" />
                </button>

                {/* Indicadores de puntos */}
                <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 5, zIndex: 2 }}>
                  {fotos.map((_, i) => (
                    <button key={i} onClick={(e) => { e.stopPropagation(); setFotoActual(i); }}
                      style={{ width: i === fotoActual ? 18 : 7, height: 7, borderRadius: i === fotoActual ? 4 : '50%', background: i === fotoActual ? '#FCD116' : 'rgba(255,255,255,0.4)', border: 'none', cursor: 'pointer', transition: 'all 0.2s', padding: 0 }} />
                  ))}
                </div>

                {/* Contador de fotos */}
                <span style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '0.7rem', padding: '3px 8px', borderRadius: 10, zIndex: 2 }}>
                  {fotoActual + 1}/{fotos.length}
                </span>
              </>
            )}
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '5rem' }}>👕</span>
          </div>
        )}

        {/* Badges */}
        {product.categoria && (
          <span style={{ position: 'absolute', top: 12, left: 12, background: '#003893', color: '#FCD116', fontFamily: 'Bebas Neue, sans-serif', fontSize: '0.7rem', letterSpacing: '0.15em', padding: '3px 10px', zIndex: 2 }}>
            {product.categoria}
          </span>
        )}
        {product.especial && (
          <span style={{ position: 'absolute', top: fotos.length > 1 ? 38 : 12, left: 12, background: '#CE1126', color: '#fff', fontFamily: 'Bebas Neue, sans-serif', fontSize: '0.7rem', letterSpacing: '0.1em', padding: '3px 10px', zIndex: 2 }}>
            {product.especial}
          </span>
        )}
      </div>

      {/* Miniaturas de fotos (si hay más de 1) */}
      {fotos.length > 1 && (
        <div style={{ display: 'flex', gap: 4, padding: '8px 10px', background: '#111', overflowX: 'auto' }}>
          {fotos.map((url, i) => (
            <button key={i} onClick={() => setFotoActual(i)}
              style={{ width: 44, height: 44, flexShrink: 0, border: `2px solid ${i === fotoActual ? '#FCD116' : 'transparent'}`, overflow: 'hidden', background: '#1a1a1a', cursor: 'pointer', padding: 0 }}>
              <img src={url} alt={`Foto ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </button>
          ))}
        </div>
      )}

      {/* ── Info ── */}
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.2rem', color: '#fff', letterSpacing: '0.04em', lineHeight: 1.15 }}>
          {product.nombre}
        </h3>

        {product.descripcion && (
          <p style={{ color: '#777', fontSize: '0.8rem', lineHeight: 1.5, flex: 1 }}>{product.descripcion}</p>
        )}

        <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.7rem', color: '#FCD116', lineHeight: 1 }}>
          {product.precio > 0
            ? <>${product.precio.toLocaleString('es-CO')}<span style={{ fontSize: '0.8rem', color: '#666', marginLeft: 6, fontFamily: 'Barlow, sans-serif', fontWeight: 400 }}>COP</span></>
            : <span style={{ fontSize: '1.1rem', color: '#888' }}>Consultar precio</span>
          }
        </p>

        {/* Tallas */}
        <div>
          <p style={{ color: '#555', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8 }}>
            Talla {selectedSize && <span style={{ color: '#FCD116' }}>— {selectedSize}</span>}
          </p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {tallas.map(t => (
              <button key={t} onClick={() => setSelectedSize(t)}
                style={{ width: 38, height: 38, border: `1.5px solid ${selectedSize === t ? '#FCD116' : '#2a2a2a'}`, background: selectedSize === t ? '#FCD116' : '#0A0A0A', color: selectedSize === t ? '#000' : '#666', fontWeight: selectedSize === t ? '700' : '400', fontSize: '0.78rem', cursor: 'pointer', transition: 'all 0.15s' }}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {error && <p style={{ color: '#CE1126', fontSize: '0.78rem' }}>⚠️ {error}</p>}

        {/* Botones */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
          <button onClick={handleAddToCart}
            style={{ width: '100%', padding: '11px', background: added ? '#003893' : '#FCD116', color: added ? '#FCD116' : '#000', fontFamily: 'Bebas Neue, sans-serif', fontSize: '0.95rem', letterSpacing: '0.1em', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.3s' }}>
            <ShoppingCart size={15} />
            {added ? '✓ AGREGADO AL CARRITO' : 'AGREGAR AL CARRITO'}
          </button>
          <button onClick={handleDirectWA}
            style={{ width: '100%', padding: '11px', background: 'transparent', color: '#25D366', fontFamily: 'Bebas Neue, sans-serif', fontSize: '0.95rem', letterSpacing: '0.1em', border: '1.5px solid #25D366', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.2s' }}>
            <MessageCircle size={15} />
            PEDIR POR WHATSAPP
          </button>
        </div>
      </div>
    </div>
  );
}
