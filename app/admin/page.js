'use client';
import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';

const TALLAS_DISPONIBLES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const CATEGORIAS = ['Local', 'Visitante', 'Entrenamiento', 'Especial'];
const PASSWORD_ADMIN = 'colombia2025'; // CAMBIA ESTO

export default function AdminPage() {
  const [auth, setAuth] = useState(false);
  const [pass, setPass] = useState('');
  const [form, setForm] = useState({ nombre: '', precio: '', descripcion: '', categoria: 'Local', tallas: [] });
  const [imagen, setImagen] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  if (!auth) {
    return (
      <div style={{ paddingTop: 64, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: '#111', border: '1px solid #333', padding: 40, maxWidth: 360, width: '100%' }}>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2rem', color: '#FCD116', marginBottom: 24 }}>ADMIN</h1>
          <input type="password" placeholder="Contraseña" value={pass} onChange={e => setPass(e.target.value)}
            style={{ width: '100%', background: '#0A0A0A', border: '1px solid #333', color: '#fff', padding: '12px 16px', marginBottom: 16, outline: 'none' }}
          />
          <button onClick={() => { if (pass === PASSWORD_ADMIN) setAuth(true); else alert('Contraseña incorrecta'); }}
            style={{ width: '100%', background: '#FCD116', color: '#000', fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.1rem', letterSpacing: '0.1em', padding: '14px', border: 'none', cursor: 'pointer' }}>
            ENTRAR
          </button>
        </div>
      </div>
    );
  }

  const handleTalla = (t) => {
    setForm(p => ({
      ...p,
      tallas: p.tallas.includes(t) ? p.tallas.filter(x => x !== t) : [...p.tallas, t]
    }));
  };

  const handleSubmit = async () => {
    if (!form.nombre || !form.precio) { setMsg('❌ Nombre y precio son requeridos'); return; }
    setLoading(true);
    setMsg('');
    try {
      let imageUrl = '';
      if (imagen) {
        const storageRef = ref(storage, `productos/${Date.now()}_${imagen.name}`);
        await uploadBytes(storageRef, imagen);
        imageUrl = await getDownloadURL(storageRef);
      }
      await addDoc(collection(db, 'productos'), {
        ...form,
        precio: Number(form.precio),
        imageUrl,
        fecha: serverTimestamp(),
      });
      setMsg('✅ Producto agregado exitosamente');
      setForm({ nombre: '', precio: '', descripcion: '', categoria: 'Local', tallas: [] });
      setImagen(null);
    } catch (e) {
      setMsg('❌ Error: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: 64, minHeight: '100vh', padding: '80px 16px 40px' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '3rem', color: '#FCD116', marginBottom: 32 }}>
          AGREGAR PRODUCTO
        </h1>

        <div className="space-y-5">
          {[
            { key: 'nombre', label: 'Nombre del producto *', placeholder: 'Ej: Camiseta Local 2024' },
            { key: 'precio', label: 'Precio (COP) *', placeholder: 'Ej: 85000', type: 'number' },
            { key: 'descripcion', label: 'Descripción', placeholder: 'Descripción del producto...', type: 'textarea' },
          ].map(f => (
            <div key={f.key}>
              <label style={{ color: '#999', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 6 }}>
                {f.label}
              </label>
              {f.type === 'textarea' ? (
                <textarea rows={3} placeholder={f.placeholder} value={form[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  style={{ width: '100%', background: '#111', border: '1px solid #333', color: '#fff', padding: '12px 16px', outline: 'none', resize: 'vertical' }} />
              ) : (
                <input type={f.type || 'text'} placeholder={f.placeholder} value={form[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  style={{ width: '100%', background: '#111', border: '1px solid #333', color: '#fff', padding: '12px 16px', outline: 'none' }} />
              )}
            </div>
          ))}

          <div>
            <label style={{ color: '#999', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 8 }}>Categoría</label>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIAS.map(c => (
                <button key={c} onClick={() => setForm(p => ({ ...p, categoria: c }))}
                  style={{ padding: '8px 18px', background: form.categoria === c ? '#FCD116' : 'transparent', color: form.categoria === c ? '#000' : '#888', border: `1px solid ${form.categoria === c ? '#FCD116' : '#333'}`, fontFamily: 'Bebas Neue, sans-serif', cursor: 'pointer' }}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ color: '#999', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 8 }}>Tallas disponibles</label>
            <div className="flex gap-2">
              {TALLAS_DISPONIBLES.map(t => (
                <button key={t} onClick={() => handleTalla(t)}
                  style={{ width: 46, height: 46, background: form.tallas.includes(t) ? '#FCD116' : 'transparent', color: form.tallas.includes(t) ? '#000' : '#888', border: `1px solid ${form.tallas.includes(t) ? '#FCD116' : '#333'}`, fontFamily: 'Bebas Neue, sans-serif', cursor: 'pointer' }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ color: '#999', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 8 }}>Imagen del producto</label>
            <input type="file" accept="image/*" onChange={e => setImagen(e.target.files[0])}
              style={{ color: '#888', fontSize: '0.9rem' }} />
            {imagen && <p style={{ color: '#4CAF50', fontSize: '0.8rem', marginTop: 4 }}>✓ {imagen.name}</p>}
          </div>

          {msg && <p style={{ color: msg.includes('✅') ? '#4CAF50' : '#CE1126', padding: 12, background: '#111', border: '1px solid #222' }}>{msg}</p>}

          <button onClick={handleSubmit} disabled={loading}
            style={{ width: '100%', padding: '18px', background: loading ? '#555' : '#FCD116', color: '#000', fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.2rem', letterSpacing: '0.15em', border: 'none', cursor: 'pointer' }}>
            {loading ? 'GUARDANDO...' : 'GUARDAR PRODUCTO'}
          </button>
        </div>
      </div>
    </div>
  );
}