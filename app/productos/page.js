'use client';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ProductCard from '@/components/ProductCard';
 
const CATEGORIAS = ['Todos', 'Oficial', 'Entrenamiento', 'Edición Especial'];
 
// Productos estáticos mientras no haya datos en Firebase
const PRODUCTOS_ESTATICOS = [
  {
    id: 'static-1',
    nombre: 'Camiseta Oficial Local Colombia 2026',
    precio: 0,
    categoria: 'Oficial',
    especial: 'MUNDIAL 2026',
    descripcion: 'La camiseta oficial de la Selección Colombia para el Mundial 2026. Versión local con los colores patrios. Tela de alta calidad, corte moderno.',
    tallas: ['S', 'M', 'L', 'XL', 'XXL'],
    imageUrl: '',
  },
  {
    id: 'static-2',
    nombre: 'Camiseta Entrenamiento Oficial Blanca',
    precio: 0,
    categoria: 'Entrenamiento',
    descripcion: 'Camiseta oficial de entrenamiento de la Selección Colombia. Color blanco, tela deportiva transpirable. Perfecta para el día a día.',
    tallas: ['S', 'M', 'L', 'XL', 'XXL'],
    imageUrl: '',
  },
  {
    id: 'static-3',
    nombre: 'Camiseta Conmemorativa 100 Años',
    precio: 0,
    categoria: 'Edición Especial',
    especial: 'EDICIÓN LIMITADA',
    descripcion: 'Edición conmemorativa por los 100 años de la Federación Colombiana de Fútbol. Diseño exclusivo, detalle especial en cuello y mangas.',
    tallas: ['S', 'M', 'L', 'XL', 'XXL'],
    imageUrl: '',
  },
];
 
export default function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoria, setCategoria] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');
  const [usandoEstaticos, setUsandoEstaticos] = useState(false);
 
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'productos'));
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (data.length > 0) {
          setProductos(data);
        } else {
          // Si no hay datos en Firebase, muestra los estáticos con precio a consultar
          setProductos(PRODUCTOS_ESTATICOS);
          setUsandoEstaticos(true);
        }
      } catch {
        setProductos(PRODUCTOS_ESTATICOS);
        setUsandoEstaticos(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);
 
  const filtrados = productos.filter(p => {
    const coincideCategoria = categoria === 'Todos' || p.categoria === categoria;
    const coincideBusqueda = p.nombre?.toLowerCase().includes(busqueda.toLowerCase());
    return coincideCategoria && coincideBusqueda;
  });
 
  return (
    <div style={{ paddingTop: 64, minHeight: '100vh' }}>
 
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #003893, #001a4d)', padding: '65px 0 45px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: '-5%', top: '50%', transform: 'translateY(-50%)', width: '40%', height: '200%', borderRadius: '50%', border: '1px solid rgba(252,209,22,0.08)' }} />
        <div className="max-w-7xl mx-auto px-4">
          <p style={{ color: '#FCD11666', fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.3em', fontSize: '0.8rem', marginBottom: 10 }}>
            LUCASPORTS · MANIZALES
          </p>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(2.5rem, 6vw, 5rem)', color: '#fff', lineHeight: 0.9 }}>
            CATÁLOGO DE<br /><span style={{ color: '#FCD116' }}>CAMISETAS</span>
          </h1>
          <p style={{ color: '#7799bb', marginTop: 14, fontSize: '0.9rem' }}>
            💵 Pago contra entrega &nbsp;·&nbsp; 📦 Envíos a toda Colombia &nbsp;·&nbsp; 💬 Pedidos por WhatsApp
          </p>
        </div>
      </div>
 
      {/* Banda tricolor */}
      <div style={{ display: 'flex', height: 6 }}>
        <div style={{ flex: 4, background: '#FCD116' }} />
        <div style={{ flex: 2, background: '#003893' }} />
        <div style={{ flex: 2, background: '#CE1126' }} />
      </div>
 
      {/* Aviso precio */}
      {usandoEstaticos && (
        <div style={{ background: '#0d1a2e', borderBottom: '1px solid #003893' }}>
          <div className="max-w-7xl mx-auto px-4 py-3">
            <p style={{ color: '#7799bb', fontSize: '0.82rem', textAlign: 'center' }}>
              💬 Los precios se consultan directamente por WhatsApp · <a href="https://wa.me/573174721539" target="_blank" style={{ color: '#25D366' }}>317 472 1539</a>
            </p>
          </div>
        </div>
      )}
 
      <div className="max-w-7xl mx-auto px-4 py-10">
 
        {/* Buscador y filtros */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 36 }}>
          <input
            type="text" placeholder="🔍  Buscar camiseta..."
            value={busqueda} onChange={e => setBusqueda(e.target.value)}
            style={{
              background: '#111', border: '1px solid #222', color: '#fff',
              padding: '12px 18px', fontSize: '0.9rem', outline: 'none',
              width: '100%', maxWidth: 420
            }}
          />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {CATEGORIAS.map(c => (
              <button key={c} onClick={() => setCategoria(c)}
                style={{
                  padding: '8px 20px',
                  background: categoria === c ? '#FCD116' : 'transparent',
                  color: categoria === c ? '#000' : '#777',
                  border: `1px solid ${categoria === c ? '#FCD116' : '#2a2a2a'}`,
                  fontFamily: 'Bebas Neue, sans-serif', fontSize: '0.9rem',
                  letterSpacing: '0.1em', cursor: 'pointer', transition: 'all 0.2s'
                }}>
                {c}
              </button>
            ))}
          </div>
        </div>
 
        {/* Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', paddingTop: 80 }}>
            <div style={{
              display: 'inline-block', width: 42, height: 42,
              border: '3px solid #FCD11622', borderTopColor: '#FCD116',
              borderRadius: '50%', animation: 'spin 1s linear infinite'
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ color: '#555', marginTop: 14, fontSize: '0.9rem' }}>Cargando productos...</p>
          </div>
        ) : filtrados.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: 80 }}>
            <p style={{ fontSize: '3rem', marginBottom: 12 }}>😕</p>
            <p style={{ color: '#555' }}>No hay productos que coincidan con tu búsqueda</p>
          </div>
        ) : (
          <>
            <p style={{ color: '#444', fontSize: '0.8rem', marginBottom: 20 }}>
              {filtrados.length} producto{filtrados.length !== 1 ? 's' : ''} encontrado{filtrados.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtrados.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </>
        )}
 
        {/* Banner WhatsApp inferior */}
        <div style={{ marginTop: 64, background: '#0c0c0c', border: '1px solid #1a1a1a', padding: '32px 28px', display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontFamily: 'Bebas Neue, sans-serif', color: '#fff', fontSize: '1.4rem', letterSpacing: '0.05em', marginBottom: 4 }}>
              ¿No encuentras lo que buscas?
            </p>
            <p style={{ color: '#555', fontSize: '0.85rem' }}>Escríbenos al WhatsApp y te ayudamos con disponibilidad y tallas</p>
          </div>
          <a href="https://wa.me/573174721539?text=Hola!%20Estoy%20buscando%20una%20camiseta%20y%20quisiera%20más%20info%20🇨🇴" target="_blank"
            style={{
              background: '#25D366', color: '#fff',
              fontFamily: 'Bebas Neue, sans-serif', fontSize: '1rem',
              letterSpacing: '0.12em', padding: '14px 32px',
              border: 'none', cursor: 'pointer', textDecoration: 'none',
              display: 'inline-block', whiteSpace: 'nowrap'
            }}>
            💬 ESCRIBIR AHORA
          </a>
        </div>
      </div>
    </div>
  );
}