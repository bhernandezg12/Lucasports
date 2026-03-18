'use client';
import { useState } from 'react';
import { ShoppingCart, MessageCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
 
const TALLAS_DEFAULT = ['S', 'M', 'L', 'XL', 'XXL'];
const WA_NUMBER = '573174721539';
 
export default function ProductCard({ product }) {
  const [selectedSize, setSelectedSize] = useState('');
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
 
  const handleAddToCart = () => {
    if (!selectedSize) {
      setError('Selecciona una talla primero');
      setTimeout(() => setError(''), 2500);
      return;
    }
    addToCart(product, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };
 
  // Compra directa por WhatsApp (sin pasar por carrito)
  const handleDirectWA = () => {
    if (!selectedSize) {
      setError('Selecciona una talla primero');
      setTimeout(() => setError(''), 2500);
      return;
    }
    const mensaje = `¡Hola Luca'Sports! 🇨🇴\n\nQuiero comprar:\n• *${product.nombre}*\n• Talla: *${selectedSize}*\n• Precio: $${product.precio?.toLocaleString('es-CO')} COP\n\n¿Me confirman disponibilidad y datos de envío? El pago es contra entrega 🙏`;
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };
 
  const tallas = product.tallas?.length > 0 ? product.tallas : TALLAS_DEFAULT;
 
  return (
    <div className="card-producto group" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Imagen */}
      <div style={{ background: '#1a1a1a', height: 300, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.nombre}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
            className="group-hover:scale-105"
          />
        ) : (
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '5rem' }}>👕</span>
          </div>
        )}
 
        {/* Badge categoría */}
        {product.categoria && (
          <span style={{
            position: 'absolute', top: 12, left: 12,
            background: '#003893', color: '#FCD116',
            fontFamily: 'Bebas Neue, sans-serif', fontSize: '0.7rem',
            letterSpacing: '0.15em', padding: '3px 10px'
          }}>
            {product.categoria}
          </span>
        )}
 
        {/* Badge especial */}
        {product.especial && (
          <span style={{
            position: 'absolute', top: 12, right: 12,
            background: '#CE1126', color: '#fff',
            fontFamily: 'Bebas Neue, sans-serif', fontSize: '0.7rem',
            letterSpacing: '0.1em', padding: '3px 10px'
          }}>
            {product.especial}
          </span>
        )}
      </div>
 
      {/* Info */}
      <div style={{ padding: '18px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <h3 style={{
          fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.2rem',
          color: '#fff', letterSpacing: '0.04em', lineHeight: 1.15
        }}>
          {product.nombre}
        </h3>
 
        {product.descripcion && (
          <p style={{ color: '#777', fontSize: '0.8rem', lineHeight: 1.5, flex: 1 }}>
            {product.descripcion}
          </p>
        )}
 
        <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.7rem', color: '#FCD116', lineHeight: 1 }}>
          ${product.precio?.toLocaleString('es-CO')}
          <span style={{ fontSize: '0.8rem', color: '#666', marginLeft: 6, fontFamily: 'Barlow, sans-serif', fontWeight: 400 }}>COP</span>
        </p>
 
        {/* Selector de tallas */}
        <div>
          <p style={{ color: '#555', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8 }}>
            Talla {selectedSize && <span style={{ color: '#FCD116' }}>— {selectedSize} seleccionada</span>}
          </p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {tallas.map(t => (
              <button key={t} onClick={() => setSelectedSize(t)}
                style={{
                  width: 38, height: 38,
                  border: `1.5px solid ${selectedSize === t ? '#FCD116' : '#2a2a2a'}`,
                  background: selectedSize === t ? '#FCD116' : '#0A0A0A',
                  color: selectedSize === t ? '#000' : '#666',
                  fontWeight: selectedSize === t ? '700' : '400',
                  fontSize: '0.78rem', cursor: 'pointer',
                  transition: 'all 0.15s'
                }}>
                {t}
              </button>
            ))}
          </div>
        </div>
 
        {error && (
          <p style={{ color: '#CE1126', fontSize: '0.78rem', marginTop: -4 }}>⚠️ {error}</p>
        )}
 
        {/* Botones */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
          {/* Agregar al carrito */}
          <button onClick={handleAddToCart}
            style={{
              width: '100%', padding: '11px',
              background: added ? '#003893' : '#FCD116',
              color: added ? '#FCD116' : '#000',
              fontFamily: 'Bebas Neue, sans-serif', fontSize: '0.95rem',
              letterSpacing: '0.1em', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              transition: 'all 0.3s'
            }}>
            <ShoppingCart size={15} />
            {added ? '✓ AGREGADO AL CARRITO' : 'AGREGAR AL CARRITO'}
          </button>
 
          {/* WhatsApp directo */}
          <button onClick={handleDirectWA}
            style={{
              width: '100%', padding: '11px',
              background: 'transparent',
              color: '#25D366',
              fontFamily: 'Bebas Neue, sans-serif', fontSize: '0.95rem',
              letterSpacing: '0.1em', border: '1.5px solid #25D366', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              transition: 'all 0.2s'
            }}>
            <MessageCircle size={15} />
            PEDIR POR WHATSAPP
          </button>
        </div>
      </div>
    </div>
  );
}