'use client';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import { Trash2, Plus, Minus, CheckCircle } from 'lucide-react';

export default function CarritoPage() {
  const { cart, total, removeFromCart, updateQuantity, clearCart } = useCart();
  const [form, setForm] = useState({ nombre: '', telefono: '', direccion: '', ciudad: '', notas: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!form.nombre || !form.telefono || !form.direccion || !form.ciudad) {
      setError('Por favor completa todos los campos requeridos');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await addDoc(collection(db, 'pedidos'), {
        cliente: form,
        productos: cart,
        total,
        estado: 'pendiente',
        fecha: serverTimestamp(),
      });
      clearCart();
      setSuccess(true);
    } catch (e) {
      setError('Error al procesar el pedido. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ paddingTop: 64, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="text-center px-4">
          <CheckCircle size={64} color="#FCD116" style={{ margin: '0 auto 20px' }} />
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '3rem', color: '#fff', marginBottom: 12 }}>
            ¡PEDIDO RECIBIDO!
          </h1>
          <p style={{ color: '#aaa', marginBottom: 8 }}>Gracias por tu compra. Te contactaremos pronto para confirmar.</p>
          <p style={{ color: '#FCD116', marginBottom: 32 }}>📱 Te escribiremos al: {form.telefono}</p>
          <Link href="/productos">
            <button style={{ background: '#FCD116', color: '#000', fontFamily: 'Bebas Neue, sans-serif', fontSize: '1rem', letterSpacing: '0.12em', padding: '14px 36px', border: 'none', cursor: 'pointer' }}>
              SEGUIR COMPRANDO
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div style={{ paddingTop: 64, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="text-center px-4">
          <p style={{ fontSize: '4rem' }}>🛒</p>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2rem', color: '#fff', margin: '16px 0' }}>TU CARRITO ESTÁ VACÍO</h2>
          <Link href="/productos">
            <button style={{ background: '#FCD116', color: '#000', fontFamily: 'Bebas Neue, sans-serif', fontSize: '1rem', letterSpacing: '0.12em', padding: '14px 36px', border: 'none', cursor: 'pointer' }}>
              VER PRODUCTOS
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 64, minHeight: '100vh', padding: '80px 16px 40px' }}>
      <div className="max-w-6xl mx-auto">
        <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '3rem', color: '#fff', marginBottom: 32 }}>
          FINALIZAR PEDIDO
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Resumen */}
          <div>
            <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.4rem', color: '#FCD116', marginBottom: 16, letterSpacing: '0.1em' }}>
              RESUMEN
            </h2>
            <div className="space-y-3">
              {cart.map((item, i) => (
                <div key={i} style={{ background: '#111', border: '1px solid #222', padding: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ background: '#1a1a1a', width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {item.imageUrl ? <img src={item.imageUrl} alt="" style={{ width: 50, height: 50, objectFit: 'cover' }} /> : <span style={{ fontSize: '2rem' }}>👕</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: '#fff', fontWeight: 600 }}>{item.nombre}</p>
                    <p style={{ color: '#888', fontSize: '0.8rem' }}>Talla: {item.size}</p>
                    <p style={{ color: '#FCD116' }}>${item.precio?.toLocaleString('es-CO')}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)} style={{ background: '#222', color: '#fff', width: 26, height: 26, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Minus size={12} /></button>
                    <span style={{ color: '#fff', minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)} style={{ background: '#222', color: '#fff', width: 26, height: 26, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plus size={12} /></button>
                    <button onClick={() => removeFromCart(item.id, item.size)}><Trash2 size={16} color="#CE1126" /></button>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: '#111', border: '1px solid #FCD11633', padding: 20, marginTop: 16 }}>
              <div className="flex justify-between">
                <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.3rem', color: '#999', letterSpacing: '0.1em' }}>TOTAL</span>
                <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.5rem', color: '#FCD116' }}>
                  ${total?.toLocaleString('es-CO')} COP
                </span>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <div>
            <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.4rem', color: '#FCD116', marginBottom: 16, letterSpacing: '0.1em' }}>
              DATOS DE ENTREGA
            </h2>
            <div className="space-y-4">
              {[
                { key: 'nombre', label: 'Nombre completo *', placeholder: 'Tu nombre' },
                { key: 'telefono', label: 'Teléfono / WhatsApp *', placeholder: 'Ej: 3001234567' },
                { key: 'ciudad', label: 'Ciudad *', placeholder: 'Ej: Bogotá' },
                { key: 'direccion', label: 'Dirección de entrega *', placeholder: 'Calle 123 # 45-67' },
                { key: 'notas', label: 'Notas adicionales', placeholder: 'Ej: Apartamento, referencias...' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ color: '#999', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 6 }}>
                    {f.label}
                  </label>
                  <input
                    type="text" placeholder={f.placeholder}
                    value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    style={{ width: '100%', background: '#111', border: '1px solid #333', color: '#fff', padding: '12px 16px', outline: 'none', fontSize: '0.9rem' }}
                  />
                </div>
              ))}
            </div>

            {error && <p style={{ color: '#CE1126', fontSize: '0.85rem', marginTop: 12 }}>{error}</p>}

            <div style={{ marginTop: 16, padding: 16, background: '#0d1a0d', border: '1px solid #1a331a' }}>
              <p style={{ color: '#4CAF50', fontSize: '0.85rem' }}>💳 <strong>Pago:</strong> Contra entrega o transferencia. Te confirmamos al contactarte.</p>
            </div>

            <button onClick={handleSubmit} disabled={loading}
              style={{
                width: '100%', marginTop: 20, padding: '18px',
                background: loading ? '#555' : '#FCD116', color: '#000',
                fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.2rem',
                letterSpacing: '0.15em', border: 'none', cursor: loading ? 'not-allowed' : 'pointer'
              }}>
              {loading ? 'PROCESANDO...' : 'CONFIRMAR PEDIDO →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}