import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--surface)',
      borderTop: '1px solid var(--line)',
      marginTop: 80,
    }}>
      <div className="container-wide" style={{ padding: '56px 24px 24px' }}>
        <div className="grid grid-cols-1 md:grid-cols-4" style={{ gap: 40 }}>

          {/* Marca */}
          <div style={{ gridColumn: 'span 1' }} className="md:col-span-2">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: 'var(--ink)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.2rem', color: '#fff',
              }}>
                ⚽
              </div>
              <div>
                <p style={{
                  fontFamily: 'var(--font-display)', fontWeight: 800,
                  color: 'var(--ink)', fontSize: '1.2rem', lineHeight: 1,
                  letterSpacing: '-0.01em',
                }}>
                  LUCASPORTS
                </p>
                <p style={{
                  fontSize: '0.62rem', color: 'var(--muted)',
                  letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: 2,
                }}>
                  Temporada 26/27
                </p>
              </div>
            </div>
            <p style={{
              color: 'var(--muted)', fontSize: '0.9rem',
              lineHeight: 1.65, maxWidth: 420,
            }}>
              Tienda de camisetas oficiales, retro y de entrenamiento de los clubes
              y selecciones más grandes del mundo. Enviamos a toda Colombia con
              pago contra entrega.
            </p>
          </div>

          {/* Navegación */}
          <div>
            <p style={{
              fontWeight: 700, fontSize: '0.8rem',
              color: 'var(--ink)', letterSpacing: '0.06em',
              textTransform: 'uppercase', marginBottom: 16,
            }}>
              Tienda
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { href: '/', label: 'Inicio' },
                { href: '/productos', label: 'Catálogo' },
                { href: '/productos?cat=Selecciones', label: 'Selecciones' },
                { href: '/productos?cat=Retro', label: 'Retro' },
                { href: '/contacto', label: 'Contacto' },
              ].map(l => (
                <Link key={l.href} href={l.href}
                  style={{
                    color: 'var(--muted)', fontSize: '0.88rem',
                    textDecoration: 'none', transition: 'color 0.2s',
                  }}
                  className="hover:text-black"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contacto */}
          <div>
            <p style={{
              fontWeight: 700, fontSize: '0.8rem',
              color: 'var(--ink)', letterSpacing: '0.06em',
              textTransform: 'uppercase', marginBottom: 16,
            }}>
              Contacto
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a href="https://wa.me/573174721539" target="_blank" rel="noreferrer"
                style={{
                  color: 'var(--whatsapp)', fontSize: '0.88rem',
                  textDecoration: 'none', fontWeight: 600,
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                }}>
                💬 317 472 1539
              </a>
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>📍 Manizales, Caldas</p>
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>📦 Envíos nacionales</p>
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>💵 Pago contra entrega</p>
            </div>
            <a href="https://www.instagram.com/lucasports" target="_blank" rel="noreferrer"
              style={{
                marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '8px 14px', borderRadius: 999,
                background: 'linear-gradient(45deg, #f09433, #dc2743, #bc1888)',
                color: '#fff', fontSize: '0.78rem', fontWeight: 600,
                textDecoration: 'none',
              }}>
              📷 Instagram
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div style={{
          borderTop: '1px solid var(--line)', marginTop: 40, paddingTop: 20,
          display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between',
          alignItems: 'center', gap: 10,
        }}>
          <p style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>
            © {new Date().getFullYear()} Lucasports — Manizales, Colombia
          </p>
          <p style={{ color: 'var(--muted-2)', fontSize: '0.78rem' }}>
            Hecho con pasión para los amantes del fútbol
          </p>
        </div>
      </div>
    </footer>
  );
}
