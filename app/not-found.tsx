import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="jungle-bg min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6">🌿</div>
        <h1 className="font-heading font-black text-5xl text-gradient-gold mb-4">404</h1>
        <h2 className="font-heading font-bold text-2xl text-beni-cream mb-4">
          Página no encontrada
        </h2>
        <p className="text-beni-sand/70 font-body mb-8">
          Esta canción se perdió en la selva. Volvamos al cancionero.
        </p>
        <Link href="/" className="btn-primary">
          🏠 Volver al Inicio
        </Link>
      </div>
    </div>
  )
}
