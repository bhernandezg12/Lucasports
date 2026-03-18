export default function ContactoPage() {
  return (
    <div style={{ paddingTop: 64, minHeight: '100vh' }}>
 
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #003893, #001a4d)', padding: '65px 0 45px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: '-5%', top: '50%', transform: 'translateY(-50%)', width: '40%', height: '200%', borderRadius: '50%', border: '1px solid rgba(252,209,22,0.07)' }} />
        <div className="max-w-7xl mx-auto px-4">
          <p style={{ color: '#FCD11666', fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.3em', fontSize: '0.8rem', marginBottom: 10 }}>
            LUCASPORTS
          </p>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(2.5rem, 6vw, 5rem)', color: '#fff', lineHeight: 0.9 }}>
            CONTÁCTANOS
          </h1>
          <p style={{ color: '#7799bb', marginTop: 14, fontSize: '0.9rem' }}>
            Respondemos rápido y con mucho gusto 🇨🇴
          </p>
        </div>
      </div>
 
      {/* Banda tricolor */}
      <div style={{ display: 'flex', height: 6 }}>
        <div style={{ flex: 4, background: '#FCD116' }} />
        <div style={{ flex: 2, background: '#003893' }} />
        <div style={{ flex: 2, background: '#CE1126' }} />
      </div>
 
      <div className="max-w-5xl mx-auto px-4 py-16">
 
        {/* Cards de contacto */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: '💬',
              label: 'WhatsApp',
              value: '317 472 1539',
              sub: 'Pedidos · Preguntas · Disponibilidad',
              link: "https://wa.me/573174721539?text=Hola%20Luca'Sports!%20Quisiera%20más%20información%20🇨🇴",
              btnText: 'ABRIR WHATSAPP',
              btnColor: '#25D366',
            },
            {
              icon: '📷',
              label: 'Instagram',
              value: '@lucasports',
              sub: 'Síguenos para ver novedades',
              link: 'https://www.instagram.com/lucasports',
              btnText: 'VER PERFIL',
              btnColor: '#E1306C',
            },
            {
              icon: '📍',
              label: 'Ubicación',
              value: 'Manizales, Caldas',
              sub: 'Envíos a toda Colombia 🇨🇴',
              link: null,
              btnText: null,
              btnColor: null,
            },
          ].map(c => (
            <div key={c.label}
              style={{ background: '#111', border: '1px solid #1e1e1e', padding: '32px 24px', textAlign: 'center', transition: 'border-color 0.2s' }}
              className="hover:border-yellow-400">
              <p style={{ fontSize: '2.8rem', marginBottom: 16 }}>{c.icon}</p>
              <p style={{ fontFamily: 'Bebas Neue, sans-serif', color: '#FCD116', fontSize: '1.1rem', letterSpacing: '0.12em', marginBottom: 6 }}>
                {c.label}
              </p>
              <p style={{ color: '#fff', fontWeight: 600, fontSize: '1rem', marginBottom: 6 }}>{c.value}</p>
              <p style={{ color: '#555', fontSize: '0.8rem', marginBottom: c.link ? 20 : 0 }}>{c.sub}</p>
              {c.link && (
                <a href={c.link} target="_blank"
                  style={{
                    display: 'inline-block',
                    background: c.btnColor, color: '#fff',
                    fontFamily: 'Bebas Neue, sans-serif', fontSize: '0.85rem',
                    letterSpacing: '0.12em', padding: '10px 24px',
                    textDecoration: 'none'
                  }}>
                  {c.btnText}
                </a>
              )}
            </div>
          ))}
        </div>
 
        {/* FAQ */}
        <div>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2rem', color: '#fff', marginBottom: 28, letterSpacing: '0.05em' }}>
            PREGUNTAS FRECUENTES
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              {
                q: '¿Cómo hago un pedido?',
                a: 'Agrega las camisetas al carrito, selecciona la talla y haz clic en "Enviar por WhatsApp". Tu pedido llegará listo a nuestro chat para confirmarlo.',
              },
              {
                q: '¿Cómo es el pago?',
                a: 'Manejamos pago CONTRA ENTREGA — pagas únicamente cuando recibes el paquete en tu casa. No hay que pagar nada por adelantado.',
              },
              {
                q: '¿Quién paga el envío?',
                a: 'El costo del envío lo asume el cliente. El valor depende de la ciudad de destino y lo coordinamos contigo directamente por WhatsApp.',
              },
              {
                q: '¿Hacen envíos a toda Colombia?',
                a: '¡Sí! Enviamos a cualquier ciudad del país a través de empresas de transporte confiables.',
              },
              {
                q: '¿Cuánto demora el envío?',
                a: 'Generalmente entre 2 y 5 días hábiles según la ciudad de destino.',
              },
              {
                q: '¿Las camisetas son originales?',
                a: 'Manejamos camisetas oficiales y réplicas de alta calidad. Cada producto está descrito claramente en el catálogo.',
              },
            ].map((faq, i) => (
              <div key={i} style={{ background: '#0e0e0e', border: '1px solid #1a1a1a', padding: '20px 22px' }}>
                <p style={{ color: '#FCD116', fontWeight: 700, fontSize: '0.9rem', marginBottom: 8 }}>
                  ❓ {faq.q}
                </p>
                <p style={{ color: '#777', fontSize: '0.85rem', lineHeight: 1.65 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
 
        {/* CTA final */}
        <div style={{ marginTop: 60, background: 'linear-gradient(135deg, #003893, #001a4d)', padding: '40px 32px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'Bebas Neue, sans-serif', color: '#FCD116', fontSize: '0.85rem', letterSpacing: '0.25em', marginBottom: 10 }}>
            ¿TIENES ALGUNA OTRA PREGUNTA?
          </p>
          <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2.2rem', color: '#fff', marginBottom: 20 }}>
            ESCRÍBENOS POR WHATSAPP
          </h3>
          <a href="https://wa.me/573174721539?text=Hola%20Luca'Sports!%20Tengo%20una%20pregunta%20🇨🇴" target="_blank"
            style={{
              display: 'inline-block',
              background: '#25D366', color: '#fff',
              fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.1rem',
              letterSpacing: '0.15em', padding: '16px 48px', textDecoration: 'none'
            }}>
            💬 317 472 1539
          </a>
        </div>
      </div>
    </div>
  );
}