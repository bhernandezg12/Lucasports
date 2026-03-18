'use client';
import { useCart } from '@/context/CartContext';
import { Trash2, Plus, Minus, MessageCircle, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
 
const WA_NUMBER = '573174721539';
 
export default function CarritoPage() {
  const { cart, total, removeFromCart, updateQuantity, clearCart, itemCount } = useCart();
 
  const handleEnviarWhatsApp = () => {
    if (cart.length === 0) return;
 
    const lineas = cart.map(item =>
      `• ${item.nombre}\n  Talla: ${item.size} | Cant: ${item.quantity} | $${(item.precio * item.quantity).toLocaleString('es-CO')} COP`
    ).join('\n\n');
 
    const mensaje =
      `¡Hola Luca'Sports! 🇨🇴 Quiero hacer el siguiente pedido:\n\n` +
      `*━━━━━ MI PEDIDO ━━━━━*\n\n` +
      `${lineas}\n\n` +
      `*─────────────────────*\n` +
      `*TOTAL: $${total.toLocaleString('es-CO')} COP*\n` +
      `_(+ costo de envío a convenir)_\n\n` +
      `📦 Pago contra entrega\n\n` +
      `Por favor confirmen disponibilidad y me dan los datos de envío. ¡Gracias! 🙏`;
 
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };
 
  if (cart.length === 0) {
    return (
      <div style={{ paddingTop: 64, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '0 20px' }}>
          <ShoppingBag size={64} color="#2a2a2a" style={{ margin: '0 auto 20px' }} />
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2.5rem', color: '#fff', marginBottom: 10 }}>
            TU CARRITO ESTÁ VACÍO
          </h2>
          <p style={{ color: '#555', marginBottom: 32, fontSize: '0.9rem' }}>
            Agrega camisetas desde el catálogo para armar tu pedido
          </p>
          <Link href="/productos">
            <button style={{
              background: '#FCD116', color: '#000',
              fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.1rem',
              letterSpacing: '0.15em', padding: '15px 40px', border: 'none', cursor: 'pointer'
            }}>
              VER CATÁLOGO
            </button>
          </Link>
        </div>
      </div>
    );
  }
 
  return (
    <div style={{ paddingTop: 64, minHeight: '100vh', padding: '80px 16px 60px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
 
        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <p style={{ color: '#FCD11666', fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.25em', fontSize: '0.8rem', marginBottom: 6 }}>
            LUCASPORTS
          </p>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(2.5rem, 6vw, 4rem)', color: '#fff', lineHeight: 0.95 }}>
            TU PEDIDO
          </h1>
          <p style={{ color: '#555', marginTop: 8, fontSize: '0.85rem' }}>
            Revisa tu selección y envíala por WhatsApp para confirmar
          </p>
        </div>
 
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }} className="lg:grid-cols-[1fr_380px]">
 
          {/* Lista de productos */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <p style={{ color: '#666', fontSize: '0.8rem' }}>{itemCount} artículo{itemCount !== 1 ? 's' : ''}</p>
              <button onClick={clearCart}
                style={{ color: '#CE1126', fontSize: '0.78rem', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                Vaciar carrito
              </button>
            </div>
 
            {cart.map((item, i) => (
              <div key={i} style={{
                background: '#111', border: '1px solid #1e1e1e',
                padding: 16, display: 'flex', gap: 14, alignItems: 'center'
              }}>
                {/* Imagen */}
                <div style={{
                  width: 72, height: 72, background: '#1a1a1a', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
                }}>
                  {item.imageUrl
                    ? <img src={item.imageUrl} alt={item.nombre} style={{ width: 72, height: 72, objectFit: 'cover' }} />
                    : <span style={{ fontSize: '2.2rem' }}>👕</span>
                  }
                </div>
 
                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem', lineHeight: 1.3, marginBottom: 3 }}>
                    {item.nombre}
                  </p>
                  <p style={{ color: '#666', fontSize: '0.78rem', marginBottom: 8 }}>
                    Talla: <strong style={{ color: '#FCD116' }}>{item.size}</strong>
                    {item.precio > 0 && <span style={{ marginLeft: 12, color: '#FCD116', fontWeight: 'bold' }}>
                      ${item.precio.toLocaleString('es-CO')} c/u
                    </span>}
                  </p>
 
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                      style={{ background: '#1e1e1e', border: '1px solid #2a2a2a', color: '#fff', width: 28, height: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Minus size={12} />
                    </button>
                    <span style={{ color: '#fff', fontSize: '0.95rem', minWidth: 24, textAlign: 'center' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                      style={{ background: '#1e1e1e', border: '1px solid #2a2a2a', color: '#fff', width: 28, height: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Plus size={12} />
                    </button>
 
                    {item.precio > 0 && (
                      <span style={{ color: '#FCD116', fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.1rem', marginLeft: 8 }}>
                        ${(item.precio * item.quantity).toLocaleString('es-CO')}
                      </span>
                    )}
 
                    <button onClick={() => removeFromCart(item.id, item.size)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, marginLeft: 'auto' }}>
                      <Trash2 size={16} color="#CE1126" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
 
            <Link href="/productos" style={{ color: '#FCD116', fontSize: '0.82rem', marginTop: 4, display: 'inline-block' }}>
              ← Seguir agregando productos
            </Link>
          </div>
 
          {/* Panel de envío */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
 
            {/* Resumen */}
            <div style={{ background: '#111', border: '1px solid #1e1e1e', padding: 24 }}>
              <p style={{ fontFamily: 'Bebas Neue, sans-serif', color: '#FCD116', fontSize: '1rem', letterSpacing: '0.15em', marginBottom: 18 }}>
                RESUMEN DEL PEDIDO
              </p>
 
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 16, borderBottom: '1px solid #1e1e1e' }}>
                {cart.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                    <span style={{ color: '#666' }}>{item.nombre.substring(0, 28)}... ×{item.quantity}</span>
                    <span style={{ color: '#aaa' }}>
                      {item.precio > 0 ? `$${(item.precio * item.quantity).toLocaleString('es-CO')}` : 'A consultar'}
                    </span>
                  </div>
                ))}
              </div>
 
              {total > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, marginBottom: 8 }}>
                  <span style={{ fontFamily: 'Bebas Neue, sans-serif', color: '#999', fontSize: '1rem', letterSpacing: '0.1em' }}>SUBTOTAL</span>
                  <span style={{ fontFamily: 'Bebas Neue, sans-serif', color: '#FCD116', fontSize: '1.5rem' }}>
                    ${total.toLocaleString('es-CO')}
                  </span>
                </div>
              )}
 
              <p style={{ color: '#555', fontSize: '0.75rem' }}>
                + Costo de envío (a coordinar con nosotros vía WhatsApp)
              </p>
            </div>
 
            {/* Info pago */}
            <div style={{ background: '#0a1a0a', border: '1px solid #1a331a', padding: '16px 18px' }}>
              <p style={{ color: '#4CAF50', fontWeight: 700, fontSize: '0.9rem', marginBottom: 8 }}>
                💵 Pago CONTRA ENTREGA
              </p>
              <p style={{ color: '#4a7a4a', fontSize: '0.78rem', lineHeight: 1.6 }}>
                No necesitas pagar nada por adelantado. Pagas cuando recibes el paquete en tu casa. Así de fácil y seguro 🔒
              </p>
            </div>
 
            {/* Botón WhatsApp */}
            <button onClick={handleEnviarWhatsApp}
              style={{
                width: '100%', padding: '18px',
                background: '#25D366', color: '#fff',
                fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.15rem',
                letterSpacing: '0.1em', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                transition: 'opacity 0.2s'
              }}>
              <MessageCircle size={22} />
              ENVIAR PEDIDO POR WHATSAPP
            </button>
 
            <p style={{ color: '#333', fontSize: '0.72rem', textAlign: 'center', lineHeight: 1.5 }}>
              Al hacer clic se abrirá WhatsApp con tu pedido listo para enviar a <strong style={{ color: '#555' }}>317 472 1539</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}