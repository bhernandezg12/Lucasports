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
      `¡Hola Lucasports! Quiero hacer este pedido:\n\n` +
      `━━━━━ MI PEDIDO ━━━━━\n\n${lineas}\n\n` +
      `─────────────────────\n` +
      `TOTAL: $${total.toLocaleString('es-CO')} COP\n` +
      `(+ costo de envío a convenir)\n\n` +
      `📦 Pago contra entrega\n\nPor favor confirmen disponibilidad. ¡Gracias! 🙏`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  if (cart.length === 0) {
    return (
      <div style={{
        paddingTop: 90, minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg)',
      }}>
        <div style={{ textAlign: 'center', padding: '0 24px' }}>
          <ShoppingBag size={56} color="var(--muted-2)" style={{ margin: '0 auto 20px' }} />
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', color: 'var(--ink)',
            letterSpacing: '-0.02em', marginBottom: 12,
          }}>
            Tu carrito está vacío
          </h2>
          <p style={{ color: 'var(--muted)', marginBottom: 28, fontSize: '0.95rem' }}>
            Agrega camisetas desde la tienda para armar tu pedido.
          </p>
          <Link href="/productos" style={{ textDecoration: 'none' }}>
            <button className="btn-primary">Ver tienda</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 90, minHeight: '100vh', background: 'var(--bg)' }}>
      <div className="container-wide" style={{ padding: '32px 24px 72px' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <p style={{
            color: 'var(--muted)', fontSize: '0.78rem', fontWeight: 600,
            letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8,
          }}>
            Lucasports
          </p>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 'clamp(2rem, 4.5vw, 3rem)', color: 'var(--ink)',
            letterSpacing: '-0.02em', lineHeight: 1.05,
          }}>
            Tu pedido
          </h1>
          <p style={{ color: 'var(--muted)', marginTop: 8, fontSize: '0.9rem' }}>
            Revísalo y envíanoslo por WhatsApp para confirmar.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px]" style={{ gap: 32 }}>

          {/* Lista */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
                {itemCount} artículo{itemCount !== 1 ? 's' : ''}
              </p>
              <button onClick={clearCart}
                style={{
                  color: 'var(--muted)', fontSize: '0.78rem',
                  background: 'none', border: 'none', cursor: 'pointer',
                  textDecoration: 'underline',
                }}>
                Vaciar carrito
              </button>
            </div>

            {cart.map((item, i) => (
              <div key={i} style={{
                background: 'var(--surface)', border: '1px solid var(--line)',
                borderRadius: 14, padding: 16,
                display: 'flex', gap: 14, alignItems: 'center',
              }}>
                <div className="placeholder-jersey" style={{
                  width: 72, height: 88, borderRadius: 10, flexShrink: 0,
                  overflow: 'hidden',
                }}>
                  {item.imageUrl
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={item.imageUrl} alt={item.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ fontSize: '2rem', opacity: 0.3 }}>👕</span>
                  }
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: 'var(--ink)', fontWeight: 600, fontSize: '0.92rem', lineHeight: 1.3, marginBottom: 4 }}>
                    {item.nombre}
                  </p>
                  <p style={{ color: 'var(--muted)', fontSize: '0.8rem', marginBottom: 10 }}>
                    Talla <strong style={{ color: 'var(--ink)' }}>{item.size}</strong>
                    {item.precio > 0 && (
                      <span style={{ marginLeft: 12, color: 'var(--ink)', fontWeight: 600 }}>
                        ${item.precio.toLocaleString('es-CO')} c/u
                      </span>
                    )}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      background: 'var(--surface-alt)', border: '1px solid var(--line)',
                      borderRadius: 8, padding: 3,
                    }}>
                      <button onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                        aria-label="Menos"
                        style={{
                          width: 26, height: 26, background: 'transparent',
                          border: 'none', cursor: 'pointer', color: 'var(--ink)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                        <Minus size={12} />
                      </button>
                      <span style={{ minWidth: 22, textAlign: 'center', fontSize: '0.9rem', fontWeight: 600 }}>
                        {item.quantity}
                      </span>
                      <button onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                        aria-label="Más"
                        style={{
                          width: 26, height: 26, background: 'transparent',
                          border: 'none', cursor: 'pointer', color: 'var(--ink)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                        <Plus size={12} />
                      </button>
                    </div>

                    {item.precio > 0 && (
                      <span style={{
                        fontFamily: 'var(--font-display)', fontWeight: 700,
                        color: 'var(--ink)', fontSize: '1rem',
                      }}>
                        ${(item.precio * item.quantity).toLocaleString('es-CO')}
                      </span>
                    )}

                    <button onClick={() => removeFromCart(item.id, item.size)}
                      aria-label="Eliminar"
                      style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                      <Trash2 size={16} color="var(--muted)" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <Link href="/productos" style={{
              color: 'var(--ink)', fontSize: '0.85rem',
              marginTop: 8, textDecoration: 'none', fontWeight: 500,
            }}>
              ← Seguir comprando
            </Link>
          </div>

          {/* Panel resumen */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{
              background: 'var(--surface)', border: '1px solid var(--line)',
              borderRadius: 14, padding: 24,
            }}>
              <p style={{
                fontWeight: 700, fontSize: '0.85rem',
                color: 'var(--ink)', letterSpacing: '0.06em',
                textTransform: 'uppercase', marginBottom: 16,
              }}>
                Resumen
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 16, borderBottom: '1px solid var(--line)' }}>
                {cart.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', gap: 12 }}>
                    <span style={{ color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.nombre} ×{item.quantity}
                    </span>
                    <span style={{ color: 'var(--ink)', fontWeight: 500, flexShrink: 0 }}>
                      {item.precio > 0 ? `$${(item.precio * item.quantity).toLocaleString('es-CO')}` : 'A consultar'}
                    </span>
                  </div>
                ))}
              </div>

              {total > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 16, marginBottom: 8 }}>
                  <span style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Subtotal</span>
                  <span style={{
                    fontFamily: 'var(--font-display)', fontWeight: 800,
                    color: 'var(--ink)', fontSize: '1.5rem',
                  }}>
                    ${total.toLocaleString('es-CO')}
                  </span>
                </div>
              )}

              <p style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>
                + Costo de envío a coordinar por WhatsApp
              </p>
            </div>

            <div style={{
              background: '#F0FDF4', border: '1px solid #BBF7D0',
              borderRadius: 12, padding: '14px 16px',
            }}>
              <p style={{ color: '#166534', fontWeight: 700, fontSize: '0.88rem', marginBottom: 4 }}>
                💵 Pago contra entrega
              </p>
              <p style={{ color: '#166534', fontSize: '0.78rem', lineHeight: 1.5, opacity: 0.85 }}>
                No pagas nada por adelantado. Pagas al recibir el paquete en tu casa.
              </p>
            </div>

            <button onClick={handleEnviarWhatsApp} className="btn-whatsapp" style={{ padding: '18px', fontSize: '1rem', justifyContent: 'center' }}>
              <MessageCircle size={18} />
              Enviar pedido por WhatsApp
            </button>

            <p style={{ color: 'var(--muted-2)', fontSize: '0.75rem', textAlign: 'center', lineHeight: 1.5 }}>
              Se abrirá WhatsApp con tu pedido listo para enviar a{' '}
              <strong style={{ color: 'var(--muted)' }}>317 472 1539</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
