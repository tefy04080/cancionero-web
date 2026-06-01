import Link from 'next/link'

export default function UnauthorizedPage() {
  return (
    <div className="jungle-bg min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Icono */}
        <div className="text-7xl mb-6">🚫</div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
          style={{ background: 'rgba(199,75,42,0.15)', border: '1px solid rgba(199,75,42,0.3)' }}>
          <span className="text-beni-terra text-sm font-medium font-body">Acceso Restringido</span>
        </div>

        <h1 className="font-heading font-black text-3xl text-beni-cream mb-4">
          No tienes permiso para acceder aquí
        </h1>

        <p className="text-beni-sand/70 font-body mb-3 leading-relaxed">
          Esta sección es exclusiva para <strong className="text-beni-gold">moderadores</strong> y{' '}
          <strong className="text-beni-gold">administradores</strong> del Cancionero del Beni.
        </p>

        <p className="text-beni-sand/50 font-body text-sm mb-8">
          Si crees que deberías tener acceso, contacta a un administrador de la plataforma.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="btn-primary">
            🏠 Ir al Inicio
          </Link>
          <Link href="/contribuir" className="btn-secondary">
            🎵 Aportar Canción
          </Link>
        </div>

        <div className="mt-12 text-beni-sand/30 text-sm font-body">
          🌿 Cancionero del Beni — Cultura del Oriente Boliviano
        </div>
      </div>
    </div>
  )
}
