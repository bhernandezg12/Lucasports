'use client';
import { useState, useEffect, useCallback } from 'react';
import {
  collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp,
  setDoc, getDoc, updateDoc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import {
  Trash2, Plus, Package, X, Image as ImageIcon,
  LayoutDashboard, Images, Megaphone, LogOut,
} from 'lucide-react';

const TALLAS_DISPONIBLES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const CATEGORIAS_SUGERIDAS = [
  'Premier League', 'LaLiga', 'Serie A', 'Bundesliga', 'Ligue 1',
  'MLS', 'Selecciones', 'Retro', 'Entrenamiento', 'Liga Colombiana',
];
const PASSWORD_ADMIN = 'lucasports2026';
const MAX_IMAGENES = 5;

const FORM_INICIAL = {
  nombre: '',
  precio: '',
  descripcion: '',
  categoria: 'Premier League',
  especial: '',
  tallas: ['S', 'M', 'L', 'XL'],
};

const BANNER_INICIAL = {
  activo: true,
  titulo: 'Espacio Publicitario Disponible',
  subtitulo: 'Anuncia tu negocio aquí',
  precio_o_oferta: 'Contáctanos por WhatsApp',
  cta: 'Más información',
  href: 'https://wa.me/573174721539',
  imagen: '',
  color_fondo: '#0B0B0B',
  color_texto: '#FFFFFF',
  color_acento: '#FFE066',
};

const SLIDE_INICIAL = {
  titulo: '',
  subtitulo: '',
  tag: '',
  liga: '',
  cta: 'Ver más',
  href: '/productos',
  imageUrl: '',
  activo: true,
  orden: 0,
};

// Estilos utilitarios
const lbl = {
  color: 'var(--muted)', fontSize: '0.72rem',
  textTransform: 'uppercase', letterSpacing: '0.1em',
  display: 'block', marginBottom: 8, fontWeight: 600,
};
const inp = {
  width: '100%', background: 'var(--surface)',
  border: '1px solid var(--line)', color: 'var(--ink)',
  padding: '11px 14px', outline: 'none', fontSize: '0.9rem',
  borderRadius: 8,
};

export default function AdminPage() {
  const [auth, setAuth] = useState(false);
  const [pass, setPass] = useState('');
  const [tab, setTab] = useState('productos'); // 'productos' | 'slides' | 'banner'

  // ── PRODUCTOS ─────────────────────────────
  const [form, setForm] = useState(FORM_INICIAL);
  const [imagenes, setImagenes] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', ok: true });
  const [productos, setProductos] = useState([]);
  const [loadingProductos, setLoadingProductos] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState('');

  // ── SLIDES HERO ───────────────────────────
  const [slides, setSlides] = useState([]);
  const [slideForm, setSlideForm] = useState(SLIDE_INICIAL);
  const [slideImagen, setSlideImagen] = useState(null);
  const [slidePreview, setSlidePreview] = useState('');
  const [slideLoading, setSlideLoading] = useState(false);
  const [slideMsg, setSlideMsg] = useState({ text: '', ok: true });

  // ── BANNER PUBLICITARIO ───────────────────
  const [banner, setBanner] = useState(BANNER_INICIAL);
  const [bannerImagen, setBannerImagen] = useState(null);
  const [bannerPreview, setBannerPreview] = useState('');
  const [bannerLoading, setBannerLoading] = useState(false);
  const [bannerMsg, setBannerMsg] = useState({ text: '', ok: true });

  const cargarProductos = useCallback(async () => {
    setLoadingProductos(true);
    try {
      const snap = await getDocs(collection(db, 'productos'));
      setProductos(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) { console.error(e); }
    finally { setLoadingProductos(false); }
  }, []);

  const cargarSlides = useCallback(async () => {
    try {
      const snap = await getDocs(collection(db, 'banners_hero'));
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      data.sort((a, b) => (a.orden || 0) - (b.orden || 0));
      setSlides(data);
    } catch (e) { console.error(e); }
  }, []);

  const cargarBanner = useCallback(async () => {
    try {
      const snap = await getDoc(doc(db, 'config', 'banner_publicitario'));
      if (snap.exists()) setBanner({ ...BANNER_INICIAL, ...snap.data() });
      if (snap.exists() && snap.data().imagen) setBannerPreview(snap.data().imagen);
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => {
    if (auth) {
      cargarProductos();
      cargarSlides();
      cargarBanner();
    }
  }, [auth, cargarProductos, cargarSlides, cargarBanner]);

  // Categorías dinámicas: sugeridas + existentes + nueva
  const categoriasExistentes = Array.from(new Set(productos.map(p => p.categoria).filter(Boolean)));
  const categoriasDisponibles = Array.from(new Set([
    ...CATEGORIAS_SUGERIDAS,
    ...categoriasExistentes,
  ]));

  const agregarCategoriaNueva = () => {
    if (!nuevaCategoria.trim()) return;
    setForm(p => ({ ...p, categoria: nuevaCategoria.trim() }));
    setNuevaCategoria('');
  };

  const handleImagenes = (e) => {
    const files = Array.from(e.target.files);
    const disponibles = MAX_IMAGENES - imagenes.length;
    const nuevas = files.slice(0, disponibles);
    setImagenes(prev => [...prev, ...nuevas]);
    nuevas.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => setPreviews(prev => [...prev, reader.result]);
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const eliminarImagen = (index) => {
    setImagenes(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleTalla = (t) => {
    setForm(p => ({
      ...p,
      tallas: p.tallas.includes(t) ? p.tallas.filter(x => x !== t) : [...p.tallas, t],
    }));
  };

  const handleGuardar = async () => {
    if (!form.nombre) { setMsg({ text: '❌ El nombre es obligatorio', ok: false }); return; }
    setLoading(true);
    setMsg({ text: '', ok: true });
    try {
      const imageUrls = [];
      for (let i = 0; i < imagenes.length; i++) {
        const file = imagenes[i];
        const storageRef = ref(storage, `productos/${Date.now()}_${i}_${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        imageUrls.push(url);
      }
      await addDoc(collection(db, 'productos'), {
        ...form,
        precio: form.precio ? Number(form.precio) : 0,
        imageUrl: imageUrls[0] || '',
        imageUrls,
        fecha: serverTimestamp(),
      });
      setMsg({ text: `✅ Producto guardado (${imageUrls.length} imagen(es))`, ok: true });
      setForm(FORM_INICIAL);
      setImagenes([]);
      setPreviews([]);
      cargarProductos();
    } catch (e) {
      setMsg({ text: '❌ Error: ' + e.message, ok: false });
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Eliminar este producto?')) return;
    try { await deleteDoc(doc(db, 'productos', id)); cargarProductos(); }
    catch (e) { alert('Error: ' + e.message); }
  };

  // ── SLIDES HERO ───────────────────────────
  const handleSlideImagen = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSlideImagen(file);
    const reader = new FileReader();
    reader.onloadend = () => setSlidePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const guardarSlide = async () => {
    if (!slideForm.titulo) { setSlideMsg({ text: '❌ Título obligatorio', ok: false }); return; }
    setSlideLoading(true);
    setSlideMsg({ text: '', ok: true });
    try {
      let imageUrl = slideForm.imageUrl;
      if (slideImagen) {
        const storageRef = ref(storage, `banners_hero/${Date.now()}_${slideImagen.name}`);
        await uploadBytes(storageRef, slideImagen);
        imageUrl = await getDownloadURL(storageRef);
      }
      await addDoc(collection(db, 'banners_hero'), {
        ...slideForm,
        imageUrl,
        orden: Number(slideForm.orden) || slides.length,
        fecha: serverTimestamp(),
      });
      setSlideMsg({ text: '✅ Slide agregado', ok: true });
      setSlideForm(SLIDE_INICIAL);
      setSlideImagen(null);
      setSlidePreview('');
      cargarSlides();
    } catch (e) {
      setSlideMsg({ text: '❌ Error: ' + e.message, ok: false });
    } finally {
      setSlideLoading(false);
    }
  };

  const toggleSlideActivo = async (id, activo) => {
    try {
      await updateDoc(doc(db, 'banners_hero', id), { activo: !activo });
      cargarSlides();
    } catch (e) { alert('Error: ' + e.message); }
  };

  const eliminarSlide = async (id) => {
    if (!confirm('¿Eliminar este slide?')) return;
    try { await deleteDoc(doc(db, 'banners_hero', id)); cargarSlides(); }
    catch (e) { alert('Error: ' + e.message); }
  };

  // ── BANNER PUBLICITARIO ───────────────────
  const handleBannerImagen = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBannerImagen(file);
    const reader = new FileReader();
    reader.onloadend = () => setBannerPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const guardarBanner = async () => {
    setBannerLoading(true);
    setBannerMsg({ text: '', ok: true });
    try {
      let imagen = banner.imagen;
      if (bannerImagen) {
        const storageRef = ref(storage, `banner_publicitario/${Date.now()}_${bannerImagen.name}`);
        await uploadBytes(storageRef, bannerImagen);
        imagen = await getDownloadURL(storageRef);
      }
      await setDoc(doc(db, 'config', 'banner_publicitario'), { ...banner, imagen });
      setBanner(b => ({ ...b, imagen }));
      setBannerMsg({ text: '✅ Banner actualizado', ok: true });
      setBannerImagen(null);
    } catch (e) {
      setBannerMsg({ text: '❌ Error: ' + e.message, ok: false });
    } finally {
      setBannerLoading(false);
    }
  };

  const handleLogin = () => {
    if (pass === PASSWORD_ADMIN) setAuth(true);
    else alert('Contraseña incorrecta');
  };

  // ═══════════════════════════════════════════════════════
  // LOGIN
  // ═══════════════════════════════════════════════════════
  if (!auth) {
    return (
      <div style={{
        paddingTop: 84, minHeight: '100vh', background: 'var(--bg)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}>
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--line)',
          borderRadius: 18, padding: '40px 36px', maxWidth: 400, width: '100%',
        }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%', background: 'var(--ink)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 14, fontSize: '1.6rem',
            }}>
              🔐
            </div>
            <p style={{
              fontFamily: 'var(--font-display)', fontWeight: 800,
              color: 'var(--ink)', fontSize: '1.4rem', letterSpacing: '-0.02em',
            }}>
              Panel Admin
            </p>
            <p style={{ color: 'var(--muted)', fontSize: '0.82rem', marginTop: 4 }}>
              Lucasports
            </p>
          </div>
          <input type="password" placeholder="Contraseña" value={pass}
            onChange={e => setPass(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleLogin(); }}
            style={{ ...inp, marginBottom: 14 }}
          />
          <button onClick={handleLogin} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            Entrar
          </button>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════
  // PANEL
  // ═══════════════════════════════════════════════════════
  const tabs = [
    { id: 'productos', label: 'Productos', icon: Package, count: productos.length },
    { id: 'slides', label: 'Slides del Hero', icon: Images, count: slides.length },
    { id: 'banner', label: 'Banner Publicitario', icon: Megaphone, count: null },
  ];

  return (
    <div style={{ paddingTop: 100, minHeight: '100vh', background: 'var(--bg)', padding: '100px 20px 60px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 28, flexWrap: 'wrap', gap: 12,
        }}>
          <div>
            <p style={{
              color: 'var(--muted)', fontSize: '0.72rem', fontWeight: 600,
              letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4,
            }}>
              Lucasports
            </p>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', color: 'var(--ink)',
              letterSpacing: '-0.02em',
            }}>
              Panel de administración
            </h1>
          </div>
          <button onClick={() => setAuth(false)} className="btn-outline" style={{ padding: '10px 16px' }}>
            <LogOut size={14} /> Cerrar sesión
          </button>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: 4, marginBottom: 28,
          background: 'var(--surface)', border: '1px solid var(--line)',
          borderRadius: 12, padding: 4, overflowX: 'auto',
        }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{
                flex: 1, minWidth: 140, padding: '11px 16px',
                background: tab === t.id ? 'var(--ink)' : 'transparent',
                color: tab === t.id ? '#fff' : 'var(--ink-soft)',
                border: 'none', borderRadius: 8, cursor: 'pointer',
                fontSize: '0.85rem', fontWeight: 500,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'all 0.15s',
              }}>
              <t.icon size={15} />
              {t.label}
              {t.count !== null && (
                <span style={{
                  background: tab === t.id ? 'rgba(255,255,255,0.2)' : 'var(--surface-alt)',
                  color: tab === t.id ? '#fff' : 'var(--muted)',
                  borderRadius: 999, padding: '1px 8px', fontSize: '0.72rem', fontWeight: 600,
                }}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ─── TAB PRODUCTOS ─── */}
        {tab === 'productos' && (
          <div style={{ display: 'grid', gap: 24 }}>
            <div style={{
              background: 'var(--surface)', border: '1px solid var(--line)',
              borderRadius: 14, padding: 24,
            }}>
              <p style={{
                fontFamily: 'var(--font-display)', fontWeight: 700,
                color: 'var(--ink)', fontSize: '1.05rem', marginBottom: 20,
              }}>
                + Agregar producto
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={lbl}>Nombre del producto *</label>
                  <input type="text" placeholder="Ej: Camiseta Local Once Caldas 2026"
                    value={form.nombre} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))} style={inp} />
                </div>

                <div>
                  <label style={lbl}>Precio en COP (solo números, sin puntos)</label>
                  <input type="number" placeholder="89000"
                    value={form.precio} onChange={e => setForm(p => ({ ...p, precio: e.target.value }))} style={inp} />
                  {form.precio && Number(form.precio) > 0 && (
                    <p style={{ color: 'var(--muted)', fontSize: '0.78rem', marginTop: 6 }}>
                      Se mostrará como: <strong style={{ color: 'var(--ink)' }}>${Number(form.precio).toLocaleString('es-CO')} COP</strong>
                    </p>
                  )}
                </div>

                <div>
                  <label style={lbl}>Descripción</label>
                  <textarea rows={3} placeholder="Descripción del producto..."
                    value={form.descripcion} onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))}
                    style={{ ...inp, resize: 'vertical' }} />
                </div>

                <div>
                  <label style={lbl}>
                    Etiqueta / Liga
                    <span style={{ marginLeft: 8, color: 'var(--muted-2)', textTransform: 'none', letterSpacing: 0, fontWeight: 400 }}>
                      · escoge una o crea nueva
                    </span>
                  </label>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                    {categoriasDisponibles.map(c => (
                      <button key={c} type="button" onClick={() => setForm(p => ({ ...p, categoria: c }))}
                        style={{
                          padding: '7px 14px', borderRadius: 999,
                          background: form.categoria === c ? 'var(--ink)' : 'var(--surface-alt)',
                          color: form.categoria === c ? '#fff' : 'var(--ink-soft)',
                          border: `1px solid ${form.categoria === c ? 'var(--ink)' : 'var(--line)'}`,
                          fontSize: '0.8rem', cursor: 'pointer', fontWeight: 500,
                        }}>
                        {c}
                      </button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input type="text" placeholder="+ Añadir nueva etiqueta (Ej: Liga Colombiana)"
                      value={nuevaCategoria}
                      onChange={e => setNuevaCategoria(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); agregarCategoriaNueva(); } }}
                      style={{ ...inp, flex: 1 }}
                    />
                    <button type="button" onClick={agregarCategoriaNueva} className="btn-outline" style={{ padding: '10px 16px', whiteSpace: 'nowrap' }}>
                      Añadir
                    </button>
                  </div>
                  <p style={{ color: 'var(--muted-2)', fontSize: '0.72rem', marginTop: 6 }}>
                    La etiqueta seleccionada aparecerá como una categoría filtrable en la tienda y en el home.
                  </p>
                </div>

                <div>
                  <label style={lbl}>Badge especial (opcional — Ej: NUEVO, PREVENTA, RETRO)</label>
                  <input type="text" placeholder="Deja vacío si no aplica"
                    value={form.especial} onChange={e => setForm(p => ({ ...p, especial: e.target.value }))} style={inp} />
                </div>

                <div>
                  <label style={lbl}>Tallas disponibles</label>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {TALLAS_DISPONIBLES.map(t => (
                      <button key={t} type="button" onClick={() => handleTalla(t)}
                        style={{
                          width: 44, height: 44, borderRadius: 8,
                          background: form.tallas.includes(t) ? 'var(--ink)' : 'var(--surface-alt)',
                          color: form.tallas.includes(t) ? '#fff' : 'var(--ink-soft)',
                          border: `1px solid ${form.tallas.includes(t) ? 'var(--ink)' : 'var(--line)'}`,
                          fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600,
                        }}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={lbl}>
                    Imágenes ({imagenes.length}/{MAX_IMAGENES})
                  </label>
                  {imagenes.length < MAX_IMAGENES && (
                    <label style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      background: 'var(--surface-alt)', border: '1px dashed var(--line-strong)',
                      color: 'var(--muted)', padding: '10px 18px', cursor: 'pointer',
                      fontSize: '0.85rem', borderRadius: 8, marginBottom: 12,
                    }}>
                      <ImageIcon size={16} />
                      + Agregar fotos ({MAX_IMAGENES - imagenes.length} disponibles)
                      <input type="file" accept="image/*" multiple onChange={handleImagenes} style={{ display: 'none' }} />
                    </label>
                  )}
                  {previews.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
                      {previews.map((src, i) => (
                        <div key={i} style={{
                          position: 'relative', aspectRatio: '1',
                          border: i === 0 ? '2px solid var(--ink)' : '1px solid var(--line)',
                          borderRadius: 8, overflow: 'hidden',
                        }}>
                          {i === 0 && (
                            <span style={{
                              position: 'absolute', top: 4, left: 4,
                              background: 'var(--ink)', color: '#fff',
                              fontSize: '0.6rem', padding: '2px 6px', borderRadius: 4,
                              zIndex: 1, letterSpacing: '0.05em', fontWeight: 600,
                            }}>
                              PRINCIPAL
                            </span>
                          )}
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={src} alt={`Foto ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <button onClick={() => eliminarImagen(i)}
                            style={{
                              position: 'absolute', top: 4, right: 4,
                              background: 'var(--season)', border: 'none', borderRadius: '50%',
                              width: 22, height: 22, cursor: 'pointer',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                            <X size={12} color="#fff" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {msg.text && (
                  <div style={{
                    background: msg.ok ? '#F0FDF4' : '#FEF2F2',
                    border: `1px solid ${msg.ok ? '#BBF7D0' : '#FECACA'}`,
                    padding: '10px 14px', borderRadius: 8,
                  }}>
                    <p style={{ color: msg.ok ? '#166534' : '#991B1B', fontSize: '0.85rem' }}>
                      {msg.text}
                    </p>
                  </div>
                )}

                <button onClick={handleGuardar} disabled={loading}
                  className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 14 }}>
                  <Plus size={16} />
                  {loading ? 'Subiendo...' : 'Guardar producto'}
                </button>
              </div>
            </div>

            {/* Lista productos */}
            <div>
              <p style={{
                fontFamily: 'var(--font-display)', fontWeight: 700,
                color: 'var(--ink)', fontSize: '1rem', marginBottom: 12,
              }}>
                Productos en tienda ({productos.length})
              </p>
              {loadingProductos ? (
                <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Cargando...</p>
              ) : productos.length === 0 ? (
                <div style={{
                  background: 'var(--surface)', border: '1px dashed var(--line-strong)',
                  padding: '40px 20px', textAlign: 'center', borderRadius: 12,
                }}>
                  <p style={{ fontSize: '2rem', marginBottom: 6 }}>📦</p>
                  <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Aún no hay productos</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {productos.map(p => (
                    <div key={p.id} style={{
                      background: 'var(--surface)', border: '1px solid var(--line)',
                      padding: '12px 14px', display: 'flex', gap: 12,
                      alignItems: 'center', borderRadius: 10,
                    }}>
                      <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                        {(p.imageUrls || [p.imageUrl]).filter(Boolean).slice(0, 3).map((url, i) => (
                          <div key={i} style={{ width: 40, height: 40, background: 'var(--surface-alt)', overflow: 'hidden', borderRadius: 6 }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={url} alt="" style={{ width: 40, height: 40, objectFit: 'cover' }} />
                          </div>
                        ))}
                        {!p.imageUrl && !p.imageUrls?.length && (
                          <div style={{ width: 40, height: 40, background: 'var(--surface-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6 }}>
                            <span style={{ fontSize: '1.1rem' }}>👕</span>
                          </div>
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ color: 'var(--ink)', fontSize: '0.85rem', fontWeight: 600 }}>{p.nombre}</p>
                        <p style={{ color: 'var(--muted)', fontSize: '0.72rem', marginTop: 2 }}>
                          {p.categoria} · {p.precio > 0 ? `$${p.precio.toLocaleString('es-CO')}` : 'A consultar'} · {(p.imageUrls?.length || (p.imageUrl ? 1 : 0))} foto(s)
                        </p>
                      </div>
                      <button onClick={() => handleEliminar(p.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6 }} title="Eliminar">
                        <Trash2 size={15} color="var(--season)" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── TAB SLIDES HERO ─── */}
        {tab === 'slides' && (
          <div style={{ display: 'grid', gap: 24 }}>
            <div style={{
              background: '#EFF6FF', border: '1px solid #DBEAFE',
              padding: '14px 18px', borderRadius: 10,
            }}>
              <p style={{ color: '#1E40AF', fontSize: '0.85rem', lineHeight: 1.55 }}>
                🎬 Los slides que agregues aquí se muestran en el <strong>carrusel principal del home</strong>.
                Se recomiendan mínimo 3 y máximo 8. Puedes usarlos para noticias, ofertas del momento,
                lanzamientos, etc. Si no hay slides activos, el hero muestra tus productos destacados.
              </p>
            </div>

            <div style={{
              background: 'var(--surface)', border: '1px solid var(--line)',
              borderRadius: 14, padding: 24,
            }}>
              <p style={{
                fontFamily: 'var(--font-display)', fontWeight: 700,
                color: 'var(--ink)', fontSize: '1.05rem', marginBottom: 20,
              }}>
                + Nuevo slide
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={lbl}>Título grande *</label>
                  <input type="text" placeholder="Ej: Preventa LaLiga 26/27"
                    value={slideForm.titulo} onChange={e => setSlideForm(p => ({ ...p, titulo: e.target.value }))} style={inp} />
                </div>
                <div>
                  <label style={lbl}>Subtítulo / descripción corta</label>
                  <input type="text" placeholder="Ej: Reserva la de tu club antes del kickoff"
                    value={slideForm.subtitulo} onChange={e => setSlideForm(p => ({ ...p, subtitulo: e.target.value }))} style={inp} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={lbl}>Etiqueta arriba (Ej: Nuevo · Oferta)</label>
                    <input type="text" placeholder="Nuevo · Preventa"
                      value={slideForm.tag} onChange={e => setSlideForm(p => ({ ...p, tag: e.target.value }))} style={inp} />
                  </div>
                  <div>
                    <label style={lbl}>Etiqueta esquina imagen</label>
                    <input type="text" placeholder="LALIGA"
                      value={slideForm.liga} onChange={e => setSlideForm(p => ({ ...p, liga: e.target.value }))} style={inp} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12 }}>
                  <div>
                    <label style={lbl}>Texto botón</label>
                    <input type="text" placeholder="Ver ahora"
                      value={slideForm.cta} onChange={e => setSlideForm(p => ({ ...p, cta: e.target.value }))} style={inp} />
                  </div>
                  <div>
                    <label style={lbl}>Link del botón</label>
                    <input type="text" placeholder="/productos?cat=LaLiga"
                      value={slideForm.href} onChange={e => setSlideForm(p => ({ ...p, href: e.target.value }))} style={inp} />
                  </div>
                </div>
                <div>
                  <label style={lbl}>Orden (menor = aparece primero)</label>
                  <input type="number" placeholder="0"
                    value={slideForm.orden} onChange={e => setSlideForm(p => ({ ...p, orden: e.target.value }))} style={inp} />
                </div>
                <div>
                  <label style={lbl}>Imagen del slide (opcional)</label>
                  <label style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    background: 'var(--surface-alt)', border: '1px dashed var(--line-strong)',
                    color: 'var(--muted)', padding: '10px 18px', cursor: 'pointer',
                    fontSize: '0.85rem', borderRadius: 8,
                  }}>
                    <ImageIcon size={16} /> Subir imagen
                    <input type="file" accept="image/*" onChange={handleSlideImagen} style={{ display: 'none' }} />
                  </label>
                  {slidePreview && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={slidePreview} alt="preview" style={{ marginTop: 10, maxHeight: 140, borderRadius: 8, border: '1px solid var(--line)' }} />
                  )}
                </div>

                {slideMsg.text && (
                  <div style={{
                    background: slideMsg.ok ? '#F0FDF4' : '#FEF2F2',
                    border: `1px solid ${slideMsg.ok ? '#BBF7D0' : '#FECACA'}`,
                    padding: '10px 14px', borderRadius: 8,
                  }}>
                    <p style={{ color: slideMsg.ok ? '#166534' : '#991B1B', fontSize: '0.85rem' }}>{slideMsg.text}</p>
                  </div>
                )}

                <button onClick={guardarSlide} disabled={slideLoading}
                  className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 14 }}>
                  <Plus size={16} />
                  {slideLoading ? 'Subiendo...' : 'Agregar slide'}
                </button>
              </div>
            </div>

            {/* Lista slides */}
            <div>
              <p style={{
                fontFamily: 'var(--font-display)', fontWeight: 700,
                color: 'var(--ink)', fontSize: '1rem', marginBottom: 12,
              }}>
                Slides existentes ({slides.length})
              </p>
              {slides.length === 0 ? (
                <div style={{
                  background: 'var(--surface)', border: '1px dashed var(--line-strong)',
                  padding: '30px 20px', textAlign: 'center', borderRadius: 12,
                }}>
                  <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
                    Aún no hay slides. Se muestran los productos destacados como fallback.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {slides.map(s => (
                    <div key={s.id} style={{
                      background: 'var(--surface)', border: '1px solid var(--line)',
                      padding: '12px 14px', display: 'flex', gap: 12,
                      alignItems: 'center', borderRadius: 10,
                    }}>
                      <div style={{ width: 60, height: 44, background: 'var(--surface-alt)', overflow: 'hidden', borderRadius: 6, flexShrink: 0 }}>
                        {s.imageUrl
                          // eslint-disable-next-line @next/next/no-img-element
                          ? <img src={s.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🖼️</div>
                        }
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ color: 'var(--ink)', fontSize: '0.88rem', fontWeight: 600 }}>{s.titulo}</p>
                        <p style={{ color: 'var(--muted)', fontSize: '0.72rem', marginTop: 2 }}>
                          Orden {s.orden || 0} · {s.tag || 'sin tag'} · {s.href}
                        </p>
                      </div>
                      <button onClick={() => toggleSlideActivo(s.id, s.activo)}
                        style={{
                          padding: '5px 12px', borderRadius: 999,
                          background: s.activo !== false ? '#DCFCE7' : 'var(--surface-alt)',
                          color: s.activo !== false ? '#166534' : 'var(--muted)',
                          border: 'none', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer',
                        }}>
                        {s.activo !== false ? '● Activo' : '○ Oculto'}
                      </button>
                      <button onClick={() => eliminarSlide(s.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6 }} title="Eliminar">
                        <Trash2 size={15} color="var(--season)" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── TAB BANNER PUBLICITARIO ─── */}
        {tab === 'banner' && (
          <div style={{ display: 'grid', gap: 24 }}>
            <div style={{
              background: '#FFF7ED', border: '1px solid #FED7AA',
              padding: '14px 18px', borderRadius: 10,
            }}>
              <p style={{ color: '#9A3412', fontSize: '0.85rem', lineHeight: 1.55 }}>
                📣 Este es el <strong>banner publicitario oscuro</strong> que aparece en el home.
                Úsalo para promocionar negocios de familiares o vender el espacio a anunciantes.
                Se puede desactivar completamente con el interruptor de abajo.
              </p>
            </div>

            <div style={{
              background: 'var(--surface)', border: '1px solid var(--line)',
              borderRadius: 14, padding: 24,
            }}>
              {/* Preview */}
              <p style={{ ...lbl, marginBottom: 10 }}>Vista previa</p>
              <div style={{
                background: banner.color_fondo, color: banner.color_texto,
                padding: 24, borderRadius: 14, marginBottom: 24,
                display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, alignItems: 'center',
              }}>
                <div>
                  <p style={{ fontSize: '0.68rem', opacity: 0.7, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6, fontWeight: 600 }}>
                    Publicidad
                  </p>
                  {banner.subtitulo && <p style={{ fontSize: '0.78rem', opacity: 0.85, marginBottom: 8 }}>{banner.subtitulo}</p>}
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.8rem', lineHeight: 1.02, marginBottom: 8 }}>
                    {banner.titulo || 'Título aquí'}
                  </h3>
                  {banner.precio_o_oferta && (
                    <p style={{ fontWeight: 600, fontSize: '1rem', marginBottom: 14, color: banner.color_acento }}>
                      {banner.precio_o_oferta}
                    </p>
                  )}
                  <span style={{
                    display: 'inline-block',
                    background: banner.color_texto, color: banner.color_fondo,
                    padding: '9px 18px', borderRadius: 999,
                    fontWeight: 600, fontSize: '0.85rem',
                  }}>
                    {banner.cta || 'Ver más'} →
                  </span>
                </div>
                <div style={{ width: 120, height: 120, flexShrink: 0 }}>
                  {bannerPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={bannerPreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : (
                    <div style={{
                      width: '100%', height: '100%', borderRadius: '50%',
                      background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem',
                    }}>
                      📣
                    </div>
                  )}
                </div>
              </div>

              {/* Formulario */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                  <input type="checkbox" checked={banner.activo}
                    onChange={e => setBanner(b => ({ ...b, activo: e.target.checked }))}
                    style={{ width: 18, height: 18, cursor: 'pointer' }} />
                  <span style={{ color: 'var(--ink)', fontWeight: 500, fontSize: '0.9rem' }}>
                    {banner.activo ? 'Banner activo (visible en el home)' : 'Banner oculto'}
                  </span>
                </label>

                <div>
                  <label style={lbl}>Título grande *</label>
                  <input type="text" placeholder="Ej: Panadería La Vecinal"
                    value={banner.titulo} onChange={e => setBanner(b => ({ ...b, titulo: e.target.value }))} style={inp} />
                </div>
                <div>
                  <label style={lbl}>Subtítulo (línea arriba, opcional)</label>
                  <input type="text" placeholder="Ej: El mejor pan de Manizales"
                    value={banner.subtitulo} onChange={e => setBanner(b => ({ ...b, subtitulo: e.target.value }))} style={inp} />
                </div>
                <div>
                  <label style={lbl}>Oferta / línea destacada (opcional)</label>
                  <input type="text" placeholder="Ej: 20% de descuento presentando este anuncio"
                    value={banner.precio_o_oferta} onChange={e => setBanner(b => ({ ...b, precio_o_oferta: e.target.value }))} style={inp} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12 }}>
                  <div>
                    <label style={lbl}>Texto botón</label>
                    <input type="text" placeholder="Visitar" value={banner.cta}
                      onChange={e => setBanner(b => ({ ...b, cta: e.target.value }))} style={inp} />
                  </div>
                  <div>
                    <label style={lbl}>Link del anuncio (URL completa)</label>
                    <input type="text" placeholder="https://wa.me/57310..."
                      value={banner.href} onChange={e => setBanner(b => ({ ...b, href: e.target.value }))} style={inp} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                  <div>
                    <label style={lbl}>Color fondo</label>
                    <input type="color" value={banner.color_fondo}
                      onChange={e => setBanner(b => ({ ...b, color_fondo: e.target.value }))}
                      style={{ ...inp, height: 44, padding: 4 }} />
                  </div>
                  <div>
                    <label style={lbl}>Color texto</label>
                    <input type="color" value={banner.color_texto}
                      onChange={e => setBanner(b => ({ ...b, color_texto: e.target.value }))}
                      style={{ ...inp, height: 44, padding: 4 }} />
                  </div>
                  <div>
                    <label style={lbl}>Color acento</label>
                    <input type="color" value={banner.color_acento}
                      onChange={e => setBanner(b => ({ ...b, color_acento: e.target.value }))}
                      style={{ ...inp, height: 44, padding: 4 }} />
                  </div>
                </div>

                <div>
                  <label style={lbl}>Imagen / logo del anunciante (opcional)</label>
                  <label style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    background: 'var(--surface-alt)', border: '1px dashed var(--line-strong)',
                    color: 'var(--muted)', padding: '10px 18px', cursor: 'pointer',
                    fontSize: '0.85rem', borderRadius: 8,
                  }}>
                    <ImageIcon size={16} /> Subir imagen
                    <input type="file" accept="image/*" onChange={handleBannerImagen} style={{ display: 'none' }} />
                  </label>
                </div>

                {bannerMsg.text && (
                  <div style={{
                    background: bannerMsg.ok ? '#F0FDF4' : '#FEF2F2',
                    border: `1px solid ${bannerMsg.ok ? '#BBF7D0' : '#FECACA'}`,
                    padding: '10px 14px', borderRadius: 8,
                  }}>
                    <p style={{ color: bannerMsg.ok ? '#166534' : '#991B1B', fontSize: '0.85rem' }}>{bannerMsg.text}</p>
                  </div>
                )}

                <button onClick={guardarBanner} disabled={bannerLoading}
                  className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 14 }}>
                  {bannerLoading ? 'Guardando...' : 'Guardar cambios del banner'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
