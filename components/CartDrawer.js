'use client';
import { X, Trash2, Plus, Minus, MessageCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const WA_NUMBER = '573174721539';

export default function CartDrawer() {
  const { cart, isOpen, setIsOpen, removeFromCart, updateQuantity, total } = useCart();

  // Genera el mensaje de WhatsApp con el resumen del pedido
  const handleWhatsApp = () => {
    if (cart.length === 0) return;

    const lineas = cart.map(item =>
      `• ${item.nombre} | Talla: ${item.size} | Cant: ${item.quantity} | $${(item.precio * item.quantity).toLocaleString('es-CO')}`
    ).join('\n');

    const mensaje = `¡Hola! Quiero hacer un pedido en Luca'Sports 🇨🇴\n\n*RESUMEN DEL PEDIDO:*\n${lineas}\n\n*TOTAL: $${total.toLocaleString('es-CO')} COP*\n\n_Pago contra entrega. El envío lo asumo yo._\n\n¿Me pueden confirmar disponibilidad y datos de envío? 🙏`;

    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50"
          style={{ background: 'rgba(0,0,0,0.65)' }}
          onClick={() => setIsOpen(false)} />
      )}

      <div style={{
        background: '#111',
        borderLeft: '3px solid #FCD116',
        transition: 'transform 0.35s cubic-bezier(.4,0,.2,1)',
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        position: 'fixed', right: 0, top: 0, height: '100%',
        width: '100%', maxWidth: 380, zIndex: 51, display: 'flex', flexDirection: 'column'
      }}>

        {/* Header */}
        <div style={{ borderBottom: '1px solid #FCD11622', padding: '18px 20px' }}
          className="flex items-center justify-between">
          <div>
            <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', color: '#FCD116', fontSize: '1.8rem', letterSpacing: '0.05em' }}>
              Tu Pedido
            </h2>
            <p style={{ color: '#666', fontSize: '0.72rem', marginTop: 2 }}>
              Se enviará por WhatsApp para confirmar
            </p>
          </div>
          <button onClick={() => setIsOpen(false)}
            style={{ background: '#1a1a1a', border: '1px solid #333', padding: 6, cursor: 'pointer' }}>
            <X color="#FCD116" size={20} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {cart.length === 0 ? (
            <div className="text-center" style={{ marginTop: 60 }}>
              <p style={{ fontSize: '3.5rem', marginBottom: 12 }}>🛒</p>
              <p style={{ color: '#555', fontSize: '0.9rem' }}>Tu carrito está vacío</p>
              <button onClick={() => setIsOpen(false)}
                style={{
                  marginTop: 20, background: '#FCD116', color: '#000',
                  fontFamily: 'Bebas Neue, sans-serif', fontSize: '1rem',
                  letterSpacing: '0.1em', padding: '10px 28px', border: 'none', cursor: 'pointer'
                }}>
                VER PRODUCTOS
              </button>
            </div>
          ) : (
            cart.map((item, i) => (
              <div key={i} style={{
                background: '#1a1a1a', border: '1px solid #2a2a2a',
                padding: 14, display: 'flex', gap: 12, alignItems: 'center'
              }}>
                {/* Imagen / emoji */}
                <div style={{
                  width: 64, height: 64, background: '#222', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
                }}>
                  {item.imageUrl
                    ? <img src={item.imageUrl} alt={item.nombre} style={{ width: 64, height: 64, objectFit: 'cover' }} />
                    : <span style={{ fontSize: '2rem' }}>👕</span>
                  }
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.85rem', lineHeight: 1.3, marginBottom: 2 }}>
                    {item.nombre}
                  </p>
                  <p style={{ color: '#888', fontSize: '0.75rem', marginBottom: 6 }}>Talla: <strong style={{ color: '#FCD116' }}>{item.size}</strong></p>

                  <div className="flex items-center" style={{ gap: 8 }}>
                    <button onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                      style={{ background: '#2a2a2a', border: '1px solid #333', color: '#fff', width: 24, height: 24, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Minus size={11} />
                    </button>
                    <span style={{ color: '#fff', fontSize: '0.9rem', minWidth: 18, textAlign: 'center' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                      style={{ background: '#2a2a2a', border: '1px solid #333', color: '#fff', width: 24, height: 24, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Plus size={11} />
                    </button>
                    <span style={{ color: '#FCD116', fontWeight: 'bold', fontSize: '0.9rem', marginLeft: 'auto' }}>
                      ${(item.precio * item.quantity).toLocaleString('es-CO')}
                    </span>
                    <button onClick={() => removeFromCart(item.id, item.size)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
                      <Trash2 size={15} color="#CE1126" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer con botón WhatsApp */}
        {cart.length > 0 && (
          <div style={{ borderTop: '1px solid #FCD11622', padding: 20 }}>
            {/* Aviso envío */}
            <div style={{ background: '#0d1a0d', border: '1px solid #1e3a1e', padding: '10px 14px', marginBottom: 16 }}>
              <p style={{ color: '#4CAF50', fontSize: '0.78rem', lineHeight: 1.5 }}>
                ✅ <strong>Pago CONTRA ENTREGA</strong> — pagas al recibir<br />
                📦 Envíos a toda Colombia · El costo de envío lo asumes tú
              </p>
            </div>

            <div className="flex justify-between items-center" style={{ marginBottom: 16 }}>
              <span style={{ fontFamily: 'Bebas Neue, sans-serif', color: '#999', fontSize: '1rem', letterSpacing: '0.1em' }}>
                SUBTOTAL
              </span>
              <span style={{ fontFamily: 'Bebas Neue, sans-serif', color: '#FCD116', fontSize: '1.5rem' }}>
                ${total.toLocaleString('es-CO')} COP
              </span>
            </div>

            <button onClick={handleWhatsApp}
              style={{
                width: '100%', padding: '15px',
                background: '#25D366', color: '#fff',
                fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.1rem',
                letterSpacing: '0.1em', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'background 0.2s'
              }}>
              <MessageCircle size={20} />
              PEDIR POR WHATSAPP →
            </button>
            <p style={{ color: '#555', fontSize: '0.7rem', textAlign: 'center', marginTop: 8 }}>
              Se abrirá WhatsApp con tu pedido listo para enviar
            </p>
          </div>
        )}
      </div>
    </>
  );
}
