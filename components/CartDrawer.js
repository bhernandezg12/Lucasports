'use client';
import { X, Trash2, Plus, Minus, MessageCircle, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const WA_NUMBER = '573174721539';

export default function CartDrawer() {
  const { cart, isOpen, setIsOpen, removeFromCart, updateQuantity, total } = useCart();

  const handleWhatsApp = () => {
    if (cart.length === 0) return;
    const lineas = cart.map(item =>
      `• ${item.nombre} | Talla: ${item.size} | Cant: ${item.quantity} | $${(item.precio * item.quantity).toLocaleString('es-CO')}`
    ).join('\n');
    const mensaje = `¡Hola Lucasports! Quiero hacer un pedido:\n\n${lineas}\n\nTOTAL: $${total.toLocaleString('es-CO')} COP\n\nPago contra entrega. ¿Me confirman disponibilidad y envío? 🙏`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-50"
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
          onClick={() => setIsOpen(false)}
        />
      )}

      <div style={{
        background: 'var(--surface)',
        borderLeft: '1px solid var(--line)',
        transition: 'transform 0.35s cubic-bezier(.4,0,.2,1)',
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        position: 'fixed', right: 0, top: 0, height: '100%',
        width: '100%', maxWidth: 420, zIndex: 51,
        display: 'flex', flexDirection: 'column',
      }}>

        {/* Header */}
        <div style={{
          borderBottom: '1px solid var(--line)',
          padding: '20px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontWeight: 700,
              color: 'var(--ink)', fontSize: '1.15rem',
              letterSpacing: '-0.01em',
            }}>
              Tu carrito
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.78rem', marginTop: 2 }}>
              {cart.length} artículo{cart.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button onClick={() => setIsOpen(false)}
            aria-label="Cerrar"
            style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'var(--surface-alt)', border: 'none',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--ink)',
            }}>
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: 60 }}>
              <ShoppingBag size={48} color="var(--muted-2)" style={{ margin: '0 auto 16px' }} />
              <p style={{ color: 'var(--ink)', fontWeight: 600, marginBottom: 6 }}>
                Tu carrito está vacío
              </p>
              <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: 20 }}>
                Agrega productos para empezar
              </p>
              <button onClick={() => setIsOpen(false)} className="btn-primary">
                Ver tienda
              </button>
            </div>
          ) : (
            cart.map((item, i) => (
              <div key={i} style={{
                background: 'var(--surface-alt)', border: '1px solid var(--line)',
                borderRadius: 12, padding: 12,
                display: 'flex', gap: 12, alignItems: 'center',
              }}>
                <div className="placeholder-jersey" style={{
                  width: 60, height: 72, borderRadius: 8, flexShrink: 0,
                  overflow: 'hidden',
                }}>
                  {item.imageUrl
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={item.imageUrl} alt={item.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ fontSize: '1.6rem', opacity: 0.3 }}>👕</span>
                  }
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    color: 'var(--ink)', fontWeight: 600, fontSize: '0.85rem',
                    lineHeight: 1.3, marginBottom: 2,
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>
                    {item.nombre}
                  </p>
                  <p style={{ color: 'var(--muted)', fontSize: '0.75rem', marginBottom: 8 }}>
                    Talla <strong style={{ color: 'var(--ink)' }}>{item.size}</strong>
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      background: 'var(--surface)', border: '1px solid var(--line)',
                      borderRadius: 8, padding: 2,
                    }}>
                      <button onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                        aria-label="Menos"
                        style={{
                          width: 24, height: 24, background: 'transparent',
                          border: 'none', cursor: 'pointer', color: 'var(--ink)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                        <Minus size={12} />
                      </button>
                      <span style={{ minWidth: 20, textAlign: 'center', fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)' }}>
                        {item.quantity}
                      </span>
                      <button onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                        aria-label="Más"
                        style={{
                          width: 24, height: 24, background: 'transparent',
                          border: 'none', cursor: 'pointer', color: 'var(--ink)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                        <Plus size={12} />
                      </button>
                    </div>
                    <span style={{ color: 'var(--ink)', fontWeight: 700, fontSize: '0.9rem', marginLeft: 'auto' }}>
                      ${(item.precio * item.quantity).toLocaleString('es-CO')}
                    </span>
                    <button onClick={() => removeFromCart(item.id, item.size)}
                      aria-label="Eliminar"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                      <Trash2 size={14} color="var(--muted)" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{ borderTop: '1px solid var(--line)', padding: '20px 24px' }}>
            <div style={{
              background: 'var(--surface-alt)',
              borderRadius: 10, padding: '12px 14px', marginBottom: 16,
            }}>
              <p style={{ color: 'var(--ink)', fontSize: '0.8rem', lineHeight: 1.5 }}>
                ✅ <strong>Pago contra entrega</strong> — pagas al recibir.<br />
                📦 Envíos a toda Colombia (costo asumido por el cliente).
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Subtotal</span>
              <span style={{
                fontFamily: 'var(--font-display)', fontWeight: 800,
                color: 'var(--ink)', fontSize: '1.4rem',
              }}>
                ${total.toLocaleString('es-CO')} <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--muted)' }}>COP</span>
              </span>
            </div>

            <button onClick={handleWhatsApp} className="btn-whatsapp" style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '0.95rem' }}>
              <MessageCircle size={16} />
              Pedir por WhatsApp
            </button>
            <p style={{ color: 'var(--muted)', fontSize: '0.72rem', textAlign: 'center', marginTop: 10 }}>
              Se abrirá WhatsApp con tu pedido listo para enviar
            </p>
          </div>
        )}
      </div>
    </>
  );
}
