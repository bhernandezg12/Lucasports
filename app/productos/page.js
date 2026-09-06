'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ProductCard from '@/components/ProductCard';
import { Search, SlidersHorizontal, X } from 'lucide-react';

const CATEGORIAS = [
  'Todos',
  'Premier League',
  'LaLiga',
  'Serie A',
  'Bundesliga',
  'Ligue 1',
  'MLS',
  'Selecciones',
  'Retro',
  'Entrenamiento',
];

const RANGOS_PRECIO = [
  { label: 'Todos', min: 0, max: Infinity },
  { label: 'Menos de $100k', min: 0, max: 100000 },
  { label: '$100k – $180k', min: 100000, max: 180000 },
  { label: '$180k – $250k', min: 180000, max: 250000 },
  { label: 'Más de $250k', min: 250000, max: Infinity },
];

const PLACEHOLDERS = [
  { id: 'ph-1', nombre: 'Camiseta Local Real Madrid 26/27', precio: 189000, categoria: 'LaLiga', liga: 'LaLiga', descripcion: 'La nueva camiseta local del Real Madrid para la temporada 26/27.', destacado: true, especial: 'NUEVO' },
  { id: 'ph-2', nombre: 'Camiseta Visitante FC Barcelona 26/27', precio: 189000, categoria: 'LaLiga', liga: 'LaLiga', descripcion: 'Diseño visitante con detalles conmemorativos.' },
  { id: 'ph-3', nombre: 'Camiseta Local Manchester City 26/27', precio: 195000, categoria: 'Premier League', liga: 'Premier League', descripcion: 'La icónica camiseta celeste del City.', especial: 'NUEVO' },
  { id: 'ph-4', nombre: 'Camiseta Local Inter Miami 26/27', precio: 219000, categoria: 'MLS', liga: 'MLS', descripcion: 'La camiseta rosada del equipo de Messi.', especial: 'PREVENTA' },
  { id: 'ph-5', nombre: 'Camiseta Selección Argentina Home', precio: 179000, categoria: 'Selecciones', liga: 'Selecciones', descripcion: 'Tres estrellas sobre el pecho.' },
  { id: 'ph-6', nombre: 'Camiseta Retro Brasil 1970', precio: 159000, categoria: 'Retro', liga: 'Retro', descripcion: 'Homenaje al Brasil de Pelé.', especial: 'RETRO' },
  { id: 'ph-7', nombre: 'Camiseta Local Liverpool 26/27', precio: 195000, categoria: 'Premier League', liga: 'Premier League', descripcion: 'La legendaria roja de Anfield.' },
  { id: 'ph-8', nombre: 'Camiseta Selección Colombia Home', precio: 179000, categoria: 'Selecciones', liga: 'Selecciones', descripcion: 'La tricolor rumbo al Mundial 2026.' },
  { id: 'ph-9', nombre: 'Camiseta Local Bayern Múnich 26/27', precio: 199000, categoria: 'Bundesliga', liga: 'Bundesliga', descripcion: 'Rojo característico del gigante bávaro.' },
  { id: 'ph-10', nombre: 'Camiseta Local PSG 26/27', precio: 205000, categoria: 'Ligue 1', liga: 'Ligue 1', descripcion: 'La franja Hechter icónica del París Saint-Germain.' },
  { id: 'ph-11', nombre: 'Camiseta Local Juventus 26/27', precio: 189000, categoria: 'Serie A', liga: 'Serie A', descripcion: 'Rayas blancas y negras clásicas.' },
  { id: 'ph-12', nombre: 'Set de Entrenamiento Nike Dri-FIT', precio: 129000, categoria: 'Entrenamiento', liga: 'Entrenamiento', descripcion: 'Set completo con camiseta y pantaloneta.' },
];

function ProductosContenido() {
  const searchParams = useSearchParams();
  const catURL = searchParams.get('cat');

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoria, setCategoria] = useState(catURL || 'Todos');
  const [busqueda, setBusqueda] = useState('');
  const [rangoPrecio, setRangoPrecio] = useState(RANGOS_PRECIO[0]);
  const [orden, setOrden] = useState('recientes');
  const [showFilters, setShowFilters] = useState(false);
  const [usandoPlaceholders, setUsandoPlaceholders] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const snapshot = await getDocs(collection(db, 'productos'));
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (data.length > 0) {
          setProductos(data);
        } else {
          setProductos(PLACEHOLDERS);
          setUsandoPlaceholders(true);
        }
      } catch {
        setProductos(PLACEHOLDERS);
        setUsandoPlaceholders(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => { if (catURL) setCategoria(catURL); }, [catURL]);

  let filtrados = productos.filter(p => {
    const cat = (p.categoria || p.liga || '').toLowerCase();
    const okCat = categoria === 'Todos' || cat === categoria.toLowerCase();
    const okBus = !busqueda || p.nombre?.toLowerCase().includes(busqueda.toLowerCase());
    const precio = p.precio || 0;
    const okPrecio = precio === 0 || (precio >= rangoPrecio.min && precio <= rangoPrecio.max);
    return okCat && okBus && okPrecio;
  });

  if (orden === 'precio-asc') filtrados = [...filtrados].sort((a, b) => (a.precio || 0) - (b.precio || 0));
  if (orden === 'precio-desc') filtrados = [...filtrados].sort((a, b) => (b.precio || 0) - (a.precio || 0));
  if (orden === 'nombre') filtrados = [...filtrados].sort((a, b) => (a.nombre || '').localeCompare(b.nombre || ''));

  return (
    <div style={{ paddingTop: 90, minHeight: '100vh', background: 'var(--bg)' }}>

      {/* Header limpio */}
      <div className="container-wide" style={{ paddingTop: 32, paddingBottom: 24 }}>
        <p style={{
          color: 'var(--muted)', fontSize: '0.78rem', fontWeight: 600,
          letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10,
        }}>
          Lucasports · Temporada 26/27
        </p>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: 'clamp(2.2rem, 5vw, 3.6rem)', color: 'var(--ink)',
          letterSpacing: '-0.03em', lineHeight: 1.02,
        }}>
          Tienda
        </h1>
        <p style={{ color: 'var(--muted)', marginTop: 10, fontSize: '0.95rem', maxWidth: 560 }}>
          Camisetas oficiales de las grandes ligas, selecciones y ediciones retro.
          Pago contra entrega, envíos a toda Colombia.
        </p>
      </div>

      {usandoPlaceholders && (
        <div style={{
          background: 'var(--highlight)',
          borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)',
        }}>
          <div className="container-wide" style={{ padding: '10px 24px' }}>
            <p style={{ color: 'var(--ink)', fontSize: '0.82rem', textAlign: 'center', fontWeight: 500 }}>
              📸 Mostrando catálogo de ejemplo. Confirma disponibilidad y precios por{' '}
              <a href="https://wa.me/573174721539" target="_blank" rel="noreferrer" style={{ color: 'var(--ink)', fontWeight: 700, textDecoration: 'underline' }}>WhatsApp</a>.
            </p>
          </div>
        </div>
      )}

      <div className="container-wide" style={{ paddingTop: 24, paddingBottom: 72 }}>

        {/* Barra de búsqueda + orden + filtros */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 12,
          alignItems: 'center', marginBottom: 20,
        }}>
          <div style={{
            flex: 1, minWidth: 240,
            position: 'relative',
          }}>
            <Search size={16} color="var(--muted)"
              style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Buscar camiseta, club, selección..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              style={{
                width: '100%', padding: '12px 14px 12px 40px',
                background: 'var(--surface)', border: '1px solid var(--line)',
                borderRadius: 12, fontSize: '0.9rem', color: 'var(--ink)',
                outline: 'none', transition: 'border-color 0.2s',
              }}
              onFocus={e => e.currentTarget.style.borderColor = 'var(--ink)'}
              onBlur={e => e.currentTarget.style.borderColor = 'var(--line)'}
            />
          </div>

          <select
            value={orden}
            onChange={e => setOrden(e.target.value)}
            style={{
              padding: '11px 14px', background: 'var(--surface)',
              border: '1px solid var(--line)', borderRadius: 12,
              fontSize: '0.85rem', color: 'var(--ink)',
              cursor: 'pointer', outline: 'none',
            }}
          >
            <option value="recientes">Más recientes</option>
            <option value="precio-asc">Precio: menor a mayor</option>
            <option value="precio-desc">Precio: mayor a menor</option>
            <option value="nombre">Nombre A-Z</option>
          </select>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden"
            style={{
              padding: '11px 16px', background: 'var(--surface)',
              border: '1px solid var(--line)', borderRadius: 12,
              fontSize: '0.85rem', color: 'var(--ink)', fontWeight: 600,
              cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
            }}
          >
            <SlidersHorizontal size={14} />
            Filtros
          </button>
        </div>

        {/* Grid: sidebar filtros + productos */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 32 }}
          className="lg:grid-cols-[240px_1fr]">

          {/* Sidebar (siempre visible en desktop, toggle en móvil) */}
          <aside
            className={showFilters ? 'block' : 'hidden lg:block'}
            style={{ position: 'sticky', top: 90, alignSelf: 'start' }}
          >
            <div style={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: 14, padding: 20,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <p style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--ink)', letterSpacing: '0.02em' }}>
                  Filtros
                </p>
                <button
                  onClick={() => { setCategoria('Todos'); setBusqueda(''); setRangoPrecio(RANGOS_PRECIO[0]); }}
                  style={{
                    fontSize: '0.72rem', color: 'var(--muted)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    textDecoration: 'underline',
                  }}>
                  Limpiar
                </button>
              </div>

              {/* Categorías */}
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>
                  Liga / Categoría
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {CATEGORIAS.map(c => (
                    <button key={c} onClick={() => setCategoria(c)}
                      style={{
                        padding: '8px 10px', textAlign: 'left',
                        background: categoria === c ? 'var(--ink)' : 'transparent',
                        color: categoria === c ? '#fff' : 'var(--ink)',
                        fontSize: '0.82rem', fontWeight: categoria === c ? 600 : 500,
                        border: 'none', borderRadius: 8,
                        cursor: 'pointer', transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => { if (categoria !== c) e.currentTarget.style.background = 'var(--surface-alt)'; }}
                      onMouseLeave={e => { if (categoria !== c) e.currentTarget.style.background = 'transparent'; }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Precio */}
              <div>
                <p style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>
                  Precio
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {RANGOS_PRECIO.map(r => (
                    <button key={r.label} onClick={() => setRangoPrecio(r)}
                      style={{
                        padding: '8px 10px', textAlign: 'left',
                        background: rangoPrecio.label === r.label ? 'var(--ink)' : 'transparent',
                        color: rangoPrecio.label === r.label ? '#fff' : 'var(--ink)',
                        fontSize: '0.82rem', fontWeight: rangoPrecio.label === r.label ? 600 : 500,
                        border: 'none', borderRadius: 8,
                        cursor: 'pointer', transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => { if (rangoPrecio.label !== r.label) e.currentTarget.style.background = 'var(--surface-alt)'; }}
                      onMouseLeave={e => { if (rangoPrecio.label !== r.label) e.currentTarget.style.background = 'transparent'; }}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Grid de productos */}
          <div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <div style={{
                  display: 'inline-block', width: 40, height: 40,
                  border: '3px solid var(--line)', borderTopColor: 'var(--ink)',
                  borderRadius: '50%', animation: 'spin 1s linear infinite',
                }} />
                <p style={{ color: 'var(--muted)', marginTop: 16, fontSize: '0.88rem' }}>
                  Cargando productos...
                </p>
              </div>
            ) : filtrados.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                <p style={{ fontSize: '3rem', marginBottom: 12 }}>🔍</p>
                <p style={{ color: 'var(--ink)', fontWeight: 600, marginBottom: 6 }}>
                  No encontramos productos
                </p>
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
                  Prueba con otra búsqueda o filtro
                </p>
              </div>
            ) : (
              <>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  marginBottom: 20,
                }}>
                  <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
                    <strong style={{ color: 'var(--ink)' }}>{filtrados.length}</strong>
                    {' '}producto{filtrados.length !== 1 ? 's' : ''}
                  </p>
                  {(categoria !== 'Todos' || rangoPrecio.label !== 'Todos') && (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {categoria !== 'Todos' && (
                        <span
                          onClick={() => setCategoria('Todos')}
                          style={{
                            padding: '4px 10px 4px 12px', background: 'var(--surface)',
                            border: '1px solid var(--line)', borderRadius: 999,
                            fontSize: '0.78rem', color: 'var(--ink)',
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            cursor: 'pointer',
                          }}>
                          {categoria} <X size={12} />
                        </span>
                      )}
                      {rangoPrecio.label !== 'Todos' && (
                        <span
                          onClick={() => setRangoPrecio(RANGOS_PRECIO[0])}
                          style={{
                            padding: '4px 10px 4px 12px', background: 'var(--surface)',
                            border: '1px solid var(--line)', borderRadius: 999,
                            fontSize: '0.78rem', color: 'var(--ink)',
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            cursor: 'pointer',
                          }}>
                          {rangoPrecio.label} <X size={12} />
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" style={{ gap: 20 }}>
                  {filtrados.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
              </>
            )}

            {/* Ayuda inferior */}
            <div style={{
              marginTop: 56,
              background: 'var(--surface)', border: '1px solid var(--line)',
              borderRadius: 16, padding: 24,
              display: 'flex', flexWrap: 'wrap', gap: 16,
              alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <p style={{
                  fontFamily: 'var(--font-display)', fontWeight: 700,
                  fontSize: '1.05rem', color: 'var(--ink)', marginBottom: 4,
                }}>
                  ¿No encuentras tu camiseta?
                </p>
                <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
                  Escríbenos y te ayudamos a conseguirla.
                </p>
              </div>
              <a
                href="https://wa.me/573174721539?text=Hola!%20Busco%20una%20camiseta%20específica"
                target="_blank"
                rel="noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <button className="btn-whatsapp">
                  💬 Escribir ahora
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductosPage() {
  return (
    <Suspense fallback={<div style={{ paddingTop: 120, textAlign: 'center', minHeight: '100vh' }}>Cargando...</div>}>
      <ProductosContenido />
    </Suspense>
  );
}
