import Link from 'next/link';
 
export default function Footer() {
  return (
    <footer style={{ background: '#050505', borderTop: '4px solid #003893', marginTop: 80 }}>
      {/* Banda tricolor */}
      <div style={{ display: 'flex', height: 4 }}>
        <div style={{ flex: 4, background: '#FCD116' }} />
        <div style={{ flex: 2, background: '#003893' }} />
        <div style={{ flex: 2, background: '#CE1126' }} />
      </div>
 
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
 
          {/* Marca */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                border: '2px solid #FCD116',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(252,209,22,0.06)'
              }}>
                <span style={{ fontSize: '1.4rem' }}>⚽</span>
              </div>
              <div>
                <p style={{ fontFamily: 'Bebas Neue, sans-serif', color: '#FCD116', fontSize: '1.4rem', lineHeight: 1 }}>
                  LUCASPORTS
                </p>
                <p style={{ fontSize: '0.6rem', color: '#ffffff55', letterSpacing: '0.2em' }}>
                  MANIZALES · COLOMBIA
                </p>
              </div>
            </div>
            <p style={{ color: '#444', fontSize: '0.83rem', lineHeight: 1.7 }}>
              Tu tienda de camisetas de la Selección Colombia en Manizales.
              Productos oficiales y conmemorativos. Envíos a todo el país con pago contra entrega.
            </p>
          </div>
 
          {/* Links */}
          <div>
            <p style={{ fontFamily: 'Bebas Neue, sans-serif', color: '#FCD116', fontSize: '1rem', letterSpacing: '0.15em', marginBottom: 14 }}>
              NAVEGACIÓN
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { href: '/', label: 'Inicio' },
                { href: '/productos', label: 'Catálogo de Productos' },
                { href: '/contacto', label: 'Contacto' },
              ].map(l => (
                <Link key={l.href} href={l.href}
                  style={{ color: '#555', fontSize: '0.85rem', textDecoration: 'none', transition: 'color 0.2s' }}
                  className="hover:text-yellow-400">
                  → {l.label}
                </Link>
              ))}
            </div>
          </div>
 
          {/* Contacto */}
          <div>
            <p style={{ fontFamily: 'Bebas Neue, sans-serif', color: '#FCD116', fontSize: '1rem', letterSpacing: '0.15em', marginBottom: 14 }}>
              CONTÁCTANOS
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a href="https://wa.me/573174721539" target="_blank"
                style={{ color: '#25D366', fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                💬 WhatsApp: 317 472 1539
              </a>
              <p style={{ color: '#555', fontSize: '0.85rem' }}>📍 Manizales, Caldas</p>
              <p style={{ color: '#555', fontSize: '0.85rem' }}>🇨🇴 Envíos a toda Colombia</p>
              <p style={{ color: '#555', fontSize: '0.85rem' }}>💵 Pago contra entrega</p>
            </div>
 
            {/* Instagram */}
            <a href="https://www.instagram.com/lucasports" target="_blank"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                marginTop: 16, background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
                color: '#fff', padding: '8px 16px', fontSize: '0.8rem',
                fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.1em', textDecoration: 'none'
              }}>
              📷 INSTAGRAM
            </a>
          </div>
        </div>
 
        {/* Bottom */}
        <div style={{ borderTop: '1px solid #111', marginTop: 32, paddingTop: 20, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
          <p style={{ color: '#2a2a2a', fontSize: '0.78rem' }}>
            © {new Date().getFullYear()} LucaSports · Manizales, Colombia 🇨🇴
          </p>
          <p style={{ color: '#2a2a2a', fontSize: '0.78rem' }}>
            Hecho con 💛💙❤️ para los hinchas de la Tricolor
          </p>
        </div>
      </div>
    </footer>
  );
}
 