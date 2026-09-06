import Link from 'next/link';

export default function ProductCard({ product }) {
  const { id, nombre, precio, imageUrls, imageUrl, descuento, nuevo } = product;

  // Formato de moneda colombiana (COP)
  const precioFormateado = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(precio);

  const imgFuente = imageUrls?.[0] || imageUrl || '/placeholder.jpg';

  return (
    <div
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: '12px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'border-color 0.2s ease, transform 0.2s ease',
      }}
      className="hover:border-black"
    >
      <div>
        {/* Contenedor de Imagen Proporción 4:5 */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '4 / 5',
            backgroundColor: 'var(--bg)',
            overflow: 'hidden',
          }}
        >
          {/* Badge Acento Rojo */}
          {(descuento > 0 || nuevo) && (
            <span
              style={{
                position: 'absolute',
                top: 12,
                left: 12,
                backgroundColor: 'var(--season)',
                color: '#FFFFFF',
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: '999px',
                letterSpacing: '0.05em',
                zIndex: 2,
              }}
            >
              {descuento > 0 ? `-${descuento}%` : 'NUEVO'}
            </span>
          )}

          <img
            src={imgFuente}
            alt={nombre}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>

        {/* Nombre y Precio */}
        <div style={{ padding: '16px 16px 8px 16px' }}>
          <h3
            style={{
              color: 'var(--ink)',
              fontWeight: 600,
              fontSize: '1rem',
              lineHeight: 1.3,
              marginBottom: 4,
            }}
          >
            {nombre}
          </h3>
          <p
            style={{
              color: 'var(--ink)',
              fontWeight: 500,
              fontSize: '0.95rem',
            }}
          >
            {precioFormateado}
          </p>
        </div>
      </div>

      {/* Botones de Acción */}
      <div style={{ padding: '8px 16px 16px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <a
          href={`https://wa.me/573174721539?text=Hola!%20Quiero%20comprar%20la%20camiseta%20${encodeURIComponent(nombre)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <button
            style={{
              width: '100%',
              backgroundColor: 'var(--accent)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '6px',
              padding: '10px',
              fontWeight: 700,
              fontSize: '0.85rem',
              letterSpacing: '0.05em',
              cursor: 'pointer',
            }}
          >
            AGREGAR
          </button>
        </a>

        <Link
          href={`/productos/${id}`}
          style={{
            textAlign: 'center',
            color: 'var(--ink)',
            fontSize: '0.85rem',
            fontWeight: 500,
            textDecoration: 'underline',
          }}
        >
          Ver detalle
        </Link>
      </div>
    </div>
  );
}