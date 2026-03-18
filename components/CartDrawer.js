'use client';
import { X, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';

export default function CartDrawer() {
  const { cart, isOpen, setIsOpen, removeFromCart, updateQuantity, total } = useCart();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60" onClick={() => setIsOpen(false)} />
      )}

      {/* Drawer */}
      <div style={{
        background: '#111',
        borderLeft: '2px solid #FCD116',
        transition: 'transform 0.35s ease',
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
      }}
        className="fixed right-0 top-0 h-full w-full max-w-sm z-50 flex flex-col">

        {/* Header */}
        <div style={{ borderBottom: '1px solid #FCD11633' }} className="flex items-center justify-between p-5">
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', color: '#FCD116', fontSize: '1.8rem', letterSpacing: '0.1em' }}>
            Tu Carrito
          </h2>
          <button onClick={() => setIsOpen(false)}>
            <X color="#FCD116" size={24} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center mt-16">
              <p className="text-4xl mb-4">🛒</p>
              <p style={{ color: '#666' }}>Tu carrito está vacío</p>
              <button onClick={() => setIsOpen(false)}
                style={{ background: '#FCD116', color: '#000', fontFamily: 'Bebas Neue, sans-serif', fontSize: '1rem', letterSpacing: '0.1em' }}
                className="mt-4 px-6 py-2">
                VER PRODUCTOS
              </button>
            </div>
          ) : (
            cart.map((item, i) => (
              <div key={i} style={{ background: '#1a1a1a', border: '1px solid #333' }} className="flex gap-3 p-3">
                <div style={{ background: '#222', width: 70, height: 70, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.nombre} style={{ width: 60, height: 60, objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '2rem' }}>👕</span>
                  )}
                </div>
                <div className="flex-1">
                  <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>{item.nombre}</p>
                  <p style={{ color: '#999', fontSize: '0.8rem' }}>Talla: {item.size}</p>
                  <p style={{ color: '#FCD116', fontWeight: 'bold', fontSize: '0.95rem' }}>
                    ${item.precio?.toLocaleString('es-CO')}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                      style={{ background: '#333', color: '#fff', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Minus size={12} />
                    </button>
                    <span style={{ color: '#fff', fontSize: '0.9rem', minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                      style={{ background: '#333', color: '#fff', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Plus size={12} />
                    </button>
                    <button onClick={() => removeFromCart(item.id, item.size)} className="ml-auto">
                      <Trash2 size={16} color="#CE1126" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{ borderTop: '1px solid #FCD11633' }} className="p-5 space-y-4">
            <div className="flex justify-between">
              <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.2rem', color: '#999', letterSpacing: '0.1em' }}>TOTAL</span>
              <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.4rem', color: '#FCD116' }}>
                ${total?.toLocaleString('es-CO')}
              </span>
            </div>
            <Link href="/carrito" onClick={() => setIsOpen(false)}
              style={{ display: 'block', background: '#FCD116', color: '#000', fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.1rem', letterSpacing: '0.12em', textAlign: 'center', padding: '14px' }}>
              FINALIZAR PEDIDO
            </Link>
          </div>
        )}
      </div>
    </>
  );
}