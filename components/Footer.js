export default function Footer() {
  return (
    <footer style={{ background: '#050505', borderTop: '3px solid #003893' }} className="mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🇨🇴</span>
              <p style={{ fontFamily: 'Bebas Neue, sans-serif', color: '#FCD116', fontSize: '1.5rem' }}>LA TRICOLOR</p>
            </div>
            <p style={{ color: '#555', fontSize: '0.85rem', lineHeight: 1.7 }}>
              Tu tienda de confianza para camisetas de la Selección Colombia. Productos de alta calidad con envío a todo el país.
            </p>
          </div>
          <div>
            <p style={{ fontFamily: 'Bebas Neue, sans-serif', color: '#FCD116', fontSize: '1.1rem', letterSpacing: '0.1em', marginBottom: 12 }}>ENLACES</p>
            <div className="space-y-2">
              {['Inicio', 'Productos', 'Contacto'].map(l => (
                <p key={l} style={{ color: '#555', fontSize: '0.85rem', cursor: 'pointer' }}
                  className="hover:text-yellow-400 transition-colors">{l}</p>
              ))}
            </div>
          </div>
          <div>
            <p style={{ fontFamily: 'Bebas Neue, sans-serif', color: '#FCD116', fontSize: '1.1rem', letterSpacing: '0.1em', marginBottom: 12 }}>CONTACTO</p>
            <div className="space-y-2" style={{ color: '#555', fontSize: '0.85rem' }}>
              <p>📧 info@latricolor.com</p>
              <p>📱 +57 300 000 0000</p>
              <p>📍 Colombia 🇨🇴</p>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #1a1a1a', marginTop: 32, paddingTop: 20, textAlign: 'center' }}>
          <p style={{ color: '#333', fontSize: '0.8rem' }}>
            © {new Date().getFullYear()} La Tricolor — Hecho con 💛 en Colombia
          </p>
        </div>
      </div>
    </footer>
  );
}