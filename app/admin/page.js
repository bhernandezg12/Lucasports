'use client';
import { useState, useEffect, useCallback } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { Trash2, Plus, Package } from 'lucide-react';
 
const TALLAS_DISPONIBLES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const CATEGORIAS = ['Oficial', 'Entrenamiento', 'Edición Especial'];
const PASSWORD_ADMIN = 'lucasports2026';
 
const FORM_INICIAL = {
  nombre: '',
  precio: '',
  descripcion: '',
  categoria: 'Oficial',
  especial: '',
  tallas: ['S', 'M', 'L', 'XL'],
};
 
// Estilos reutilizables (fuera del componente para evitar re-creación)
const lbl = {
  color: '#666',
  fontSize: '0.75rem',
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  display: 'block',
  marginBottom: 8,
};
const inp = {
  width: '100%',
  background: '#0A0A0A',
  border: '1px solid #2a2a2a',
  color: '#fff',
  padding: '12px 14px',
  outline: 'none',
  fontSize: '0.88rem',
  fontFamily: 'Barlow, sans-serif',
};
 
export default function AdminPage() {
  const [auth, setAuth] = useState(false);
  const [pass, setPass] = useState('');
  const [form, setForm] = useState(FORM_INICIAL);
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', ok: true });
  const [productos, setProductos] = useState([]);
  const [loadingProductos, setLoadingProductos] = useState(false);
 
  // ✅ useCallback evita la advertencia de useEffect con dependencias
  const cargarProductos = useCallback(async () => {
    setLoadingProductos(true);
    try {
      const snap = await getDocs(collection(db, 'productos'));
      setProductos(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingProductos(false);
    }
  }, []);
 
  // ✅ useEffect correcto: depende de auth y cargarProductos
  useEffect(() => {
    if (auth) {
      cargarProductos();
    }
  }, [auth, cargarProductos]);
 
  const handleImagen = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImagen(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };
 
  const handleTalla = (t) => {
    setForm(p => ({
      ...p,
      tallas: p.tallas.includes(t)
        ? p.tallas.filter(x => x !== t)
        : [...p.tallas, t],
    }));
  };
 
  const handleGuardar = async () => {
    if (!form.nombre) {
      setMsg({ text: '❌ El nombre es obligatorio', ok: false });
      return;
    }
    setLoading(true);
    setMsg({ text: '', ok: true });
    try {
      let imageUrl = '';
      if (imagen) {
        const storageRef = ref(storage, `productos/${Date.now()}_${imagen.name}`);
        await uploadBytes(storageRef, imagen);
        imageUrl = await getDownloadURL(storageRef);
      }
      await addDoc(collection(db, 'productos'), {
        ...form,
        precio: form.precio ? Number(form.precio) : 0,
        imageUrl,
        fecha: serverTimestamp(),
      });
      setMsg({ text: '✅ Producto guardado correctamente', ok: true });
      setForm(FORM_INICIAL);
      setImagen(null);
      setPreview(null);
      cargarProductos();
    } catch (e) {
      setMsg({ text: '❌ Error: ' + e.message, ok: false });
    } finally {
      setLoading(false);
    }
  };
 
  const handleEliminar = async (id) => {
    if (!confirm('¿Eliminar este producto?')) return;
    try {
      await deleteDoc(doc(db, 'productos', id));
      cargarProductos();
    } catch (e) {
      alert('Error al eliminar: ' + e.message);
    }
  };
 
  const handleLogin = () => {
    if (pass === PASSWORD_ADMIN) {
      setAuth(true);
    } else {
      alert('Contraseña incorrecta');
    }
  };
 
  // ─── PANTALLA DE LOGIN ────────────────────────────────────
  if (!auth) {
    return (
      <div style={{
        paddingTop: 64, minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          background: '#111', border: '1px solid #222',
          padding: '40px 36px', maxWidth: 380, width: '100%',
        }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <span style={{ fontSize: '2.5rem' }}>🔐</span>
            <p style={{
              fontFamily: 'Bebas Neue, sans-serif', color: '#FCD116',
              fontSize: '1.8rem', letterSpacing: '0.05em', marginTop: 8,
            }}>
              PANEL ADMIN
            </p>
            <p style={{ color: '#444', fontSize: '0.8rem' }}>Luca&apos;Sports</p>
          </div>
          <input
            type="password"
            placeholder="Contraseña"
            value={pass}
            onChange={e => setPass(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleLogin(); }}
            style={{
              width: '100%', background: '#0A0A0A',
              border: '1px solid #2a2a2a', color: '#fff',
              padding: '13px 16px', marginBottom: 16,
              outline: 'none', fontSize: '0.9rem',
            }}
          />
          <button onClick={handleLogin} style={{
            width: '100%', background: '#FCD116', color: '#000',
            fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.1rem',
            letterSpacing: '0.1em', padding: '14px',
            border: 'none', cursor: 'pointer',
          }}>
            ENTRAR
          </button>
        </div>
      </div>
    );
  }
 
  // ─── PANEL PRINCIPAL ─────────────────────────────────────
  return (
    <div style={{ paddingTop: 64, minHeight: '100vh', padding: '80px 16px 60px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
 
        {/* Encabezado */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 36, flexWrap: 'wrap', gap: 12,
        }}>
          <div>
            <p style={{
              color: '#FCD11666', fontFamily: 'Bebas Neue, sans-serif',
              letterSpacing: '0.25em', fontSize: '0.8rem', marginBottom: 4,
            }}>
              LUCA&apos;SPORTS
            </p>
            <h1 style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              color: '#fff', lineHeight: 0.95,
            }}>
              PANEL DE ADMIN
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Package color="#FCD116" size={20} />
            <span style={{
              color: '#FCD116', fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.2rem',
            }}>
              {productos.length} producto{productos.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
 
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 32 }}>
 
          {/* ── Formulario nuevo producto ── */}
          <div style={{ background: '#111', border: '1px solid #1e1e1e', padding: 28 }}>
            <p style={{
              fontFamily: 'Bebas Neue, sans-serif', color: '#FCD116',
              fontSize: '1.2rem', letterSpacing: '0.1em', marginBottom: 24,
            }}>
              + AGREGAR PRODUCTO
            </p>
 
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
 
              {/* Nombre */}
              <div>
                <label style={lbl}>Nombre del producto *</label>
                <input
                  type="text"
                  placeholder="Ej: Camiseta Oficial Local Colombia 2026"
                  value={form.nombre}
                  onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))}
                  style={inp}
                />
              </div>
 
              {/* Precio — ✅ comillas escapadas con &quot; */}
              <div>
                <label style={lbl}>
                  Precio en COP (deja en 0 para &quot;Consultar por WhatsApp&quot;)
                </label>
                <input
                  type="number"
                  placeholder="Ej: 85000"
                  value={form.precio}
                  onChange={e => setForm(p => ({ ...p, precio: e.target.value }))}
                  style={inp}
                />
              </div>
 
              {/* Descripción */}
              <div>
                <label style={lbl}>Descripción</label>
                <textarea
                  rows={3}
                  placeholder="Descripción del producto..."
                  value={form.descripcion}
                  onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))}
                  style={{ ...inp, resize: 'vertical' }}
                />
              </div>
 
              {/* Categoría */}
              <div>
                <label style={lbl}>Categoría</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {CATEGORIAS.map(c => (
                    <button key={c} onClick={() => setForm(p => ({ ...p, categoria: c }))}
                      style={{
                        padding: '8px 16px',
                        background: form.categoria === c ? '#FCD116' : 'transparent',
                        color: form.categoria === c ? '#000' : '#777',
                        border: `1px solid ${form.categoria === c ? '#FCD116' : '#2a2a2a'}`,
                        fontFamily: 'Bebas Neue, sans-serif',
                        fontSize: '0.85rem', cursor: 'pointer',
                      }}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
 
              {/* Badge especial — ✅ comillas escapadas */}
              <div>
                <label style={lbl}>
                  Badge especial (opcional — ej: &quot;MUNDIAL 2026&quot;, &quot;EDICIÓN LIMITADA&quot;)
                </label>
                <input
                  type="text"
                  placeholder="Deja vacío si no aplica"
                  value={form.especial}
                  onChange={e => setForm(p => ({ ...p, especial: e.target.value }))}
                  style={inp}
                />
              </div>
 
              {/* Tallas */}
              <div>
                <label style={lbl}>Tallas disponibles</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {TALLAS_DISPONIBLES.map(t => (
                    <button key={t} onClick={() => handleTalla(t)}
                      style={{
                        width: 46, height: 46,
                        background: form.tallas.includes(t) ? '#FCD116' : 'transparent',
                        color: form.tallas.includes(t) ? '#000' : '#777',
                        border: `1px solid ${form.tallas.includes(t) ? '#FCD116' : '#2a2a2a'}`,
                        fontFamily: 'Bebas Neue, sans-serif',
                        fontSize: '0.85rem', cursor: 'pointer',
                      }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
 
              {/* Imagen */}
              <div>
                <label style={lbl}>Imagen del producto</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImagen}
                  style={{ color: '#777', fontSize: '0.85rem' }}
                />
                {preview && (
                  <img
                    src={preview}
                    alt="Vista previa"
                    style={{
                      marginTop: 12, width: 120, height: 120,
                      objectFit: 'cover', border: '1px solid #2a2a2a',
                    }}
                  />
                )}
              </div>
 
              {/* Mensaje de estado */}
              {msg.text && (
                <div style={{
                  background: msg.ok ? '#0d1a0d' : '#1a0d0d',
                  border: `1px solid ${msg.ok ? '#1e3a1e' : '#3a1e1e'}`,
                  padding: '12px 16px',
                }}>
                  <p style={{ color: msg.ok ? '#4CAF50' : '#CE1126', fontSize: '0.85rem' }}>
                    {msg.text}
                  </p>
                </div>
              )}
 
              {/* Botón guardar */}
              <button
                onClick={handleGuardar}
                disabled={loading}
                style={{
                  padding: '16px',
                  background: loading ? '#333' : '#FCD116',
                  color: '#000',
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: '1.1rem', letterSpacing: '0.12em',
                  border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}>
                <Plus size={18} />
                {loading ? 'GUARDANDO...' : 'GUARDAR PRODUCTO'}
              </button>
            </div>
          </div>
 
          {/* ── Lista de productos guardados ── */}
          <div>
            <p style={{
              fontFamily: 'Bebas Neue, sans-serif', color: '#FCD116',
              fontSize: '1.1rem', letterSpacing: '0.1em', marginBottom: 16,
            }}>
              PRODUCTOS EN TIENDA
            </p>
 
            {loadingProductos ? (
              <p style={{ color: '#555', fontSize: '0.85rem' }}>Cargando...</p>
            ) : productos.length === 0 ? (
              <div style={{
                background: '#0e0e0e', border: '1px dashed #2a2a2a',
                padding: '40px 20px', textAlign: 'center',
              }}>
                <p style={{ fontSize: '2rem', marginBottom: 8 }}>📦</p>
                <p style={{ color: '#444', fontSize: '0.85rem' }}>
                  Aún no hay productos. ¡Agrega el primero!
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {productos.map(p => (
                  <div key={p.id} style={{
                    background: '#0e0e0e', border: '1px solid #1e1e1e',
                    padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'center',
                  }}>
                    {/* Miniatura */}
                    <div style={{
                      width: 52, height: 52, background: '#1a1a1a',
                      flexShrink: 0, overflow: 'hidden',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {p.imageUrl
                        ? <img src={p.imageUrl} alt="" style={{ width: 52, height: 52, objectFit: 'cover' }} />
                        : <span style={{ fontSize: '1.5rem' }}>👕</span>
                      }
                    </div>
                    {/* Datos */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ color: '#fff', fontSize: '0.82rem', fontWeight: 600, lineHeight: 1.3 }}>
                        {p.nombre}
                      </p>
                      <p style={{ color: '#555', fontSize: '0.72rem', marginTop: 2 }}>
                        {p.categoria} · {p.precio > 0
                          ? `$${p.precio.toLocaleString('es-CO')} COP`
                          : 'Precio a consultar'}
                      </p>
                    </div>
                    {/* Eliminar */}
                    <button
                      onClick={() => handleEliminar(p.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, flexShrink: 0 }}
                      title="Eliminar producto">
                      <Trash2 size={16} color="#CE1126" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
 
        </div>
      </div>
    </div>
  );
}