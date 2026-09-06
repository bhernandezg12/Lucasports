'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ProductCard from '@/components/ProductCard';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';

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

  // Categorías dinámicas: 'Todos' + únicas de productos
  const CATEGORIAS = ['Todos', ...Array.from(new Set(productos.map(p => p.categoria || p.liga).filter(Boolean)))];

  let filtrados = productos.filter(p => {
    const catP = p.categoria || p.liga;
    const matchCat = categoria === 'Todos' || catP === categoria;
    const matchBusqueda = !busqueda ||
      p.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      catP?.toLowerCase().includes(busqueda.toLowerCase());
    const matchPrecio = Number(p.precio) >= rangoPrecio.min && Number(p.precio) <= rangoPrecio.max;
    return matchCat && matchBusqueda && matchPrecio;
  });

  if (orden === 'precio-asc') filtrados = [...filtrados].sort((a, b) => a.precio - b.precio);
  if (orden === 'precio-desc') filtrados = [...filtrados].sort((a, b) => b.precio - a.precio);
  if (orden === 'nombre') filtrados = [...filtrados].sort((a, b) => a.nombre.localeCompare(b.nombre));

  const activeFilters = (categoria !== 'Todos' ? 1 : 0) + (rangoPrecio.label !== 'Todos' ? 1 : 0);

  const limpiarFiltros = () => {
    setCategoria('Todos');
    setRangoPrecio(RANGOS_PRECIO[0]);
    setBusqueda('');
  };

  // Contenido del panel de filtros (usado en sidebar desktop y drawer móvil)
  const FiltrosPanel = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--ink)' }}>Filtros</p>
        {activeFilters > 0 && (
          <button onClick={limpiarFiltros}
            style={{
              color: 'var(--muted)', fontSize: '0.78rem',
              background: 'none', border: 'none', cursor: 'pointer',
              textDecoration: 'underline',
            }}>
            Limpiar
          </button>
        )}
      </div>

      <div>
        <p style={{
          fontSize: '0.72rem', fontWeight: 600, color: 'var(--muted)',
          letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10,
        }}>
          Liga / Categoría
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {CATEGORIAS.map(cat => (
            <button key={cat} onClick={() => setCategoria(cat)}
              style={{
                padding: '10px 12px', borderRadius: 8, border: 'none',
                background: categoria === cat ? 'var(--ink)' : 'transparent',
                color: categoria === cat ? '#fff' : 'var(--ink-soft)',
                textAlign: 'left', fontSize: '0.88rem', cursor: 'pointer',
                fontWeight: categoria === cat ? 600 : 400,
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { if (categoria !== cat) e.currentTarget.style.background = 'var(--surface-alt)'; }}
              onMouseLeave={e => { if (categoria !== cat) e.currentTarget.style.background = 'transparent'; }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p style={{
          fontSize: '0.72rem', fontWeight: 600, color: 'var(--muted)',
          letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10,
        }}>
          Precio
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {RANGOS_PRECIO.map(r => (
            <button key={r.label} onClick={() => setRangoPrecio(r)}
              style={{
                padding: '10px 12px', borderRadius: 8, border: 'none',
                background: rangoPrecio.label === r.label ? 'var(--ink)' : 'transparent',
                color: rangoPrecio.label === r.label ? '#fff' : 'var(--ink-soft)',
                textAlign: 'left', fontSize: '0.88rem', cursor: 'pointer',
                fontWeight: rangoPrecio.label === r.label ? 600 : 400,
                transition: 'background 0.15s',
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
  );

  return (
    <div style={{ paddingTop: 90, minHeight: '100vh', background: 'var(--bg)' }}>
      <div className="container-wide" style={{ padding: '32px 24px 24px' }}>
        <p style={{
          color: 'var(--muted)', fontSize: '0.78rem', fontWeight: 600,
          letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8,
        }}>
          Lucasports · Temporada 26/27
        </p>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', color: 'var(--ink)',
          letterSpacing: '-0.03em', lineHeight: 1.02,
        }}>
          Tienda
        </h1>
        <p style={{ color: 'var(--muted)', marginTop: 8, fontSize: '0.95rem', maxWidth: 560 }}>
          Camisetas oficiales de las grandes ligas, selecciones y ediciones retro. Pago contra entrega, envíos a toda Colombia.
        </p>

        {usandoPlaceholders && (
          <div style={{
            marginTop: 20, padding: '10px 16px',
            background: '#FFF3B0', border: '1px solid #F5D97A',
            borderRadius: 10, fontSize: '0.82rem', color: '#7A5B00',
          }}>
            📦 Catálogo de ejemplo. Sube tus productos desde <strong>/admin</strong>.
          </div>
        )}

        {/* Barra: búsqueda + ordenar + botón filtros */}
        <div style={{
          marginTop: 28, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap',
        }}>
          <div style={{ flex: 1, minWidth: 240, position: 'relative' }}>
            <Search size={18} color="var(--muted)"
              style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              type="text"
              placeholder="Buscar camiseta, club, selección..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              style={{
                width: '100%', padding: '12px 16px 12px 44px',
                border: '1px solid var(--line)', borderRadius: 999,
                fontSize: '0.9rem', background: 'var(--surface)',
                color: 'var(--ink)', outline: 'none',
              }}
            />
          </div>
          <select value={orden} onChange={e => setOrden(e.target.value)}
            style={{
              padding: '11px 16px', border: '1px solid var(--line)',
              borderRadius: 999, background: 'var(--surface)',
              fontSize: '0.85rem', cursor: 'pointer', color: 'var(--ink)',
            }}>
            <option value="recientes">Más recientes</option>
            <option value="precio-asc">Precio: menor a mayor</option>
            <option value="precio-desc">Precio: mayor a menor</option>
            <option value="nombre">Nombre A–Z</option>
          </select>
          {/* Botón filtros: siempre visible, abre drawer en móvil / colapsa sidebar en desktop */}
          <button onClick={() => setShowFilters(v => !v)}
            style={{
              padding: '11px 18px', border: '1px solid var(--line)',
              borderRadius: 999, background: showFilters ? 'var(--ink)' : 'var(--surface)',
              color: showFilters ? '#fff' : 'var(--ink)',
              fontSize: '0.85rem', cursor: 'pointer', fontWeight: 500,
              display: 'inline-flex', alignItems: 'center', gap: 8,
              position: 'relative',
            }}>
            <SlidersHorizontal size={16} />
            Filtros
            {activeFilters > 0 && (
              <span style={{
                background: showFilters ? '#fff' : 'var(--ink)',
                color: showFilters ? 'var(--ink)' : '#fff',
                borderRadius: 999, padding: '1px 7px', fontSize: '0.7rem',
                fontWeight: 700,
              }}>
                {activeFilters}
              </span>
            )}
          </button>
        </div>

        {/* Chips de filtros activos */}
        {activeFilters > 0 && (
          <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {categoria !== 'Todos' && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '5px 12px', borderRadius: 999, background: 'var(--ink)',
                color: '#fff', fontSize: '0.78rem', fontWeight: 500,
              }}>
                {categoria}
                <button onClick={() => setCategoria('Todos')}
                  style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', padding: 0 }}>
                  <X size={12} />
                </button>
              </span>
            )}
            {rangoPrecio.label !== 'Todos' && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '5px 12px', borderRadius: 999, background: 'var(--ink)',
                color: '#fff', fontSize: '0.78rem', fontWeight: 500,
              }}>
                {rangoPrecio.label}
                <button onClick={() => setRangoPrecio(RANGOS_PRECIO[0])}
                  style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', padding: 0 }}>
                  <X size={12} />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Layout dos columnas: sidebar (colapsable) + grid */}
      <div className="container-wide" style={{ padding: '20px 24px 72px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: showFilters ? '260px 1fr' : '1fr',
          gap: 32,
          transition: 'grid-template-columns 0.25s ease',
        }} className="productos-layout">

          {/* Sidebar filtros - desktop */}
          {showFilters && (
            <aside className="filtros-sidebar-desktop" style={{
              background: 'var(--surface)', border: '1px solid var(--line)',
              borderRadius: 14, padding: 20, height: 'fit-content',
              position: 'sticky', top: 100,
            }}>
              <FiltrosPanel />
            </aside>
          )}

          {/* Grid productos */}
          <div>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              marginBottom: 20,
            }}>
              <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
                {loading ? 'Cargando...' : `${filtrados.length} producto${filtrados.length !== 1 ? 's' : ''}`}
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4" style={{ gap: 20 }}>
                {[...Array(8)].map((_, i) => (
                  <div key={i} style={{
                    background: 'var(--surface)', borderRadius: 14, height: 340,
                    animation: 'pulse 1.5s ease-in-out infinite',
                  }} />
                ))}
              </div>
            ) : filtrados.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '80px 20px',
                background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--line)',
              }}>
                <p style={{ fontSize: '3rem', marginBottom: 16 }}>🔍</p>
                <p style={{ color: 'var(--ink)', fontWeight: 600, marginBottom: 6 }}>
                  Sin resultados
                </p>
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: 20 }}>
                  Prueba con otros filtros o palabras.
                </p>
                <button onClick={limpiarFiltros} className="btn-outline">
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3" style={{
                gap: 20,
                gridTemplateColumns: showFilters
                  ? 'repeat(auto-fill, minmax(220px, 1fr))'
                  : 'repeat(auto-fill, minmax(240px, 1fr))',
              }}>
                {filtrados.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Drawer móvil de filtros */}
      {showFilters && (
        <>
          <div className="filtros-mobile-backdrop"
            onClick={() => setShowFilters(false)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
              backdropFilter: 'blur(4px)', zIndex: 60, display: 'none',
            }} />
          <div className="filtros-mobile-drawer" style={{
            position: 'fixed', right: 0, top: 0, height: '100vh', width: '85%', maxWidth: 340,
            background: 'var(--surface)', borderLeft: '1px solid var(--line)',
            zIndex: 61, padding: 24, overflowY: 'auto',
            transform: showFilters ? 'translateX(0)' : 'translateX(100%)',
            transition: 'transform 0.3s ease', display: 'none',
          }}>
            <button onClick={() => setShowFilters(false)}
              style={{
                position: 'absolute', top: 16, right: 16,
                width: 36, height: 36, borderRadius: '50%',
                background: 'var(--surface-alt)', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
              <X size={18} />
            </button>
            <div style={{ marginTop: 12 }}>
              <FiltrosPanel />
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        @media (max-width: 900px) {
          .filtros-sidebar-desktop { display: none !important; }
          .productos-layout { grid-template-columns: 1fr !important; }
          .filtros-mobile-backdrop { display: block !important; }
          .filtros-mobile-drawer { display: block !important; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}

export default function ProductosPage() {
  return (
    <Suspense fallback={
      <div style={{ paddingTop: 90, minHeight: '100vh', background: 'var(--bg)' }} />
    }>
      <ProductosContenido />
    </Suspense>
  );
}
