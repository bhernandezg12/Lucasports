import Link from 'next/link';
import { MessageCircle, Instagram, MapPin } from 'lucide-react';

const FAQS = [
  { q: '¿Cómo hago un pedido?', a: 'Agrega las camisetas al carrito, selecciona la talla y toca "Pedir por WhatsApp". Tu pedido llega listo a nuestro chat para confirmarlo.' },
  { q: '¿Cómo es el pago?', a: 'Manejamos pago contra entrega — pagas únicamente cuando recibes el paquete en tu casa. No hay que pagar nada por adelantado.' },
  { q: '¿Quién paga el envío?', a: 'El costo del envío lo asume el cliente. El valor depende de la ciudad de destino y lo coordinamos contigo por WhatsApp.' },
  { q: '¿Hacen envíos a toda Colombia?', a: '¡Sí! Enviamos a cualquier ciudad del país mediante empresas de transporte confiables.' },
  { q: '¿Cuánto demora el envío?', a: 'Entre 2 y 5 días hábiles según la ciudad de destino.' },
  { q: '¿Las camisetas son originales?', a: 'Manejamos camisetas oficiales y réplicas premium. En cada producto está descrito claramente el tipo.' },
];

export default function ContactoPage() {
  return (
    <div style={{ paddingTop: 90, minHeight: '100vh', background: 'var(--bg)' }}>

      {/* Header */}
      <div className="container-wide" style={{ padding: '32px 24px 24px' }}>
        <p style={{
          color: 'var(--muted)', fontSize: '0.78rem', fontWeight: 600,
          letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10,
        }}>
          Lucasports · Manizales
        </p>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: 'clamp(2.2rem, 5vw, 3.6rem)', color: 'var(--ink)',
          letterSpacing: '-0.03em', lineHeight: 1.02,
        }}>
          Contacto
        </h1>
        <p style={{ color: 'var(--muted)', marginTop: 10, fontSize: '0.95rem', maxWidth: 560 }}>
          Respondemos rápido y con mucho gusto. Escríbenos por WhatsApp para pedidos, disponibilidad, tallas o cualquier duda.
        </p>
      </div>

      <div className="container-wide" style={{ padding: '24px 24px 72px' }}>

        {/* Cards de contacto */}
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 16, marginBottom: 64 }}>
          {[
            {
              icon: MessageCircle,
              iconColor: 'var(--whatsapp)',
              label: 'WhatsApp',
              value: '317 472 1539',
              sub: 'Pedidos · Preguntas · Disponibilidad',
              link: "https://wa.me/573174721539?text=Hola%20Lucasports!%20Quisiera%20más%20información",
              btnText: 'Abrir WhatsApp',
              btnClass: 'btn-whatsapp',
            },
            {
              icon: Instagram,
              iconColor: '#E1306C',
              label: 'Instagram',
              value: '@lucasports',
              sub: 'Síguenos para ver las novedades',
              link: 'https://www.instagram.com/lucasports',
              btnText: 'Ver perfil',
              btnClass: 'btn-outline',
            },
            {
              icon: MapPin,
              iconColor: 'var(--ink)',
              label: 'Ubicación',
              value: 'Manizales, Caldas',
              sub: 'Envíos a toda Colombia',
              link: null,
              btnText: null,
              btnClass: null,
            },
          ].map(c => (
            <div key={c.label}
              style={{
                background: 'var(--surface)', border: '1px solid var(--line)',
                borderRadius: 16, padding: 28,
                display: 'flex', flexDirection: 'column', gap: 14,
                transition: 'border-color 0.2s',
              }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: 'var(--surface-alt)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <c.icon size={22} color={c.iconColor} />
              </div>
              <div>
                <p style={{
                  fontSize: '0.78rem', fontWeight: 600,
                  color: 'var(--muted)', letterSpacing: '0.08em',
                  textTransform: 'uppercase', marginBottom: 6,
                }}>
                  {c.label}
                </p>
                <p style={{ color: 'var(--ink)', fontWeight: 700, fontSize: '1.05rem', marginBottom: 4 }}>
                  {c.value}
                </p>
                <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.5 }}>{c.sub}</p>
              </div>
              {c.link && (
                <a href={c.link} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', marginTop: 'auto' }}>
                  <button className={c.btnClass} style={{ width: '100%', justifyContent: 'center', padding: '11px 20px', fontSize: '0.85rem' }}>
                    {c.btnText}
                  </button>
                </a>
              )}
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <div style={{ marginBottom: 32, textAlign: 'center' }}>
            <p style={{ color: 'var(--muted)', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
              Ayuda
            </p>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', color: 'var(--ink)',
              letterSpacing: '-0.02em',
            }}>
              Preguntas frecuentes
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {FAQS.map((faq, i) => (
              <details key={i} style={{
                background: 'var(--surface)', border: '1px solid var(--line)',
                borderRadius: 12, padding: '18px 22px',
                cursor: 'pointer',
              }}>
                <summary style={{
                  color: 'var(--ink)', fontWeight: 600, fontSize: '0.95rem',
                  listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  {faq.q}
                  <span style={{ color: 'var(--muted)', fontSize: '1.2rem', lineHeight: 1 }}>+</span>
                </summary>
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.7, marginTop: 12 }}>
                  {faq.a}
                </p>
              </details>
            ))}
          </div>

          {/* CTA final */}
          <div style={{
            marginTop: 56, background: 'var(--ink)', color: '#fff',
            borderRadius: 20, padding: 'clamp(28px, 4vw, 44px)',
            textAlign: 'center',
          }}>
            <p style={{
              fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.12em',
              textTransform: 'uppercase', opacity: 0.7, marginBottom: 10,
            }}>
              ¿Tienes otra pregunta?
            </p>
            <h3 style={{
              fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', letterSpacing: '-0.02em',
              marginBottom: 24,
            }}>
              Escríbenos por WhatsApp
            </h3>
            <a
              href="https://wa.me/573174721539?text=Hola%20Lucasports!%20Tengo%20una%20pregunta"
              target="_blank"
              rel="noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <button className="btn-whatsapp" style={{ padding: '14px 32px', fontSize: '0.95rem' }}>
                💬 317 472 1539
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
