'use client';
import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const TALLAS = ['S', 'M', 'L', 'XL', 'XXL'];

export default function ProductCard({ product }) {
  const [selectedSize, setSelectedSize] = useState('');
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (!selectedSize) {
      setError('Selecciona una talla');
      setTimeout(() => setError(''), 2000);
      return;
    }
    addToCart(product, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="card-producto group">
      {/* Imagen */}
      <div style={{ background: '#1a1a1a', height: 280, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.nombre}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
            className="group-hover:scale-105"
          />
        ) : (
          <div className="text-center">
            <span style={{ fontSize: '5rem' }}>👕</span>
            <p style={{ color: '#444', fontSize: '0.75rem', marginTop: 8 }}>Sin imagen</p>
          </div>
        )}
        {product.categoria && (
          <span style={{
            position: 'absolute', top: 12, left: 12,
            background: '#003893', color: '#FCD116',
            fontFamily: 'Bebas Neue, sans-serif', fontSize: '0.75rem',
            letterSpacing: '0.1em', padding: '2px 10px'
          }}>
            {product.categoria}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4 space-y-3">
        <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.3rem', color: '#fff', letterSpacing: '0.05em', lineHeight: 1.1 }}>
          {product.nombre}
        </h3>
        <p style={{ color: '#FCD116', fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.5rem' }}>
          ${product.precio?.toLocaleString('es-CO')}
        </p>
        {product.descripcion && (
          <p style={{ color: '#888', fontSize: '0.82rem', lineHeight: 1.5 }}>{product.descripcion}</p>
        )}

        {/* Tallas */}
        <div>
          <p style={{ color: '#666', fontSize: '0.75rem', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Talla</p>
          <div className="flex gap-2 flex-wrap">
            {(product.tallas || TALLAS).map(t => (
              <button
                key={t}
                onClick={() => setSelectedSize(t)}
                style={{
                  width: 36, height: 36, border: `1px solid ${selectedSize === t ? '#FCD116' : '#333'}`,
                  background: selectedSize === t ? '#FCD116' : 'transparent',
                  color: selectedSize === t ? '#000' : '#999',
                  fontWeight: selectedSize === t ? 'bold' : 'normal',
                  fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s'
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {error && <p style={{ color: '#CE1126', fontSize: '0.8rem' }}>{error}</p>}

        <button onClick={handleAddToCart}
          style={{
            width: '100%', padding: '12px',
            background: added ? '#003893' : '#FCD116',
            color: added ? '#FCD116' : '#000',
            fontFamily: 'Bebas Neue, sans-serif', fontSize: '1rem',
            letterSpacing: '0.12em', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'all 0.3s'
          }}>
          <ShoppingCart size={16} />
          {added ? '¡AGREGADO! ✓' : 'AGREGAR AL CARRITO'}
        </button>
      </div>
    </div>
  );
}