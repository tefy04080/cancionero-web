import { songRepository } from '@/lib/repositories/song.repository'
import SongGrid from '@/components/songs/SongGrid'
import Link from 'next/link'
import CategoryFilter from '@/components/songs/CategoryFilter'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{ q?: string; rhythm?: string }>
}

export default async function HomePage({ searchParams }: Props) {
  const { q, rhythm } = await searchParams
  const query = q?.trim().toLowerCase() ?? ''
  const rhythmFilter = rhythm?.trim() ?? ''

  const allSongs = await songRepository.getApprovedSongs()

  // Filtrar por búsqueda de texto
  const textFiltered = query
    ? allSongs.filter(s =>
        s.title.toLowerCase().includes(query) ||
        s.rhythmType.toLowerCase().includes(query) ||
        s.lyrics.toLowerCase().includes(query)
      )
    : allSongs

  // Filtrar por ritmo
  const songs = rhythmFilter
    ? textFiltered.filter(s => s.rhythmType === rhythmFilter)
    : textFiltered

  const rhythms = [...new Set(allSongs.map(s => s.rhythmType))].sort()

  const isFiltering = !!query || !!rhythmFilter

  return (
    <div className="jungle-bg min-h-screen">
      {/* Hero — se oculta al buscar */}
      {!isFiltering && (
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-10"
              style={{ background: 'radial-gradient(circle, #f4a11d, transparent)' }} />
            <div className="absolute top-40 right-0 w-60 h-60 rounded-full opacity-10"
              style={{ background: 'radial-gradient(circle, #1e6b8a, transparent)' }} />
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{ background: 'rgba(244,161,29,0.1)', border: '1px solid rgba(244,161,29,0.3)' }}>
              <span className="text-sm">🌿</span>
              <span className="text-beni-gold text-sm font-medium font-body">
                Patrimonio Cultural del Oriente Boliviano
              </span>
            </div>

            <h1 className="mb-6 flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="Orientalist — Cancionero del Beni"
                style={{ height: '200px', width: 'auto', objectFit: 'contain' }}
                className="drop-shadow-2xl"
              />
            </h1>

            <p className="font-body text-beni-sand/80 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
              Preservando la riqueza musical de nuestra tierra. Taquiraris, Chovenas, Macheteros
              y más ritmos que nacen del corazón de la Amazonía boliviana.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="#canciones" className="btn-primary text-base px-8 py-3">
                🎵 Explorar Canciones
              </Link>
              <Link href="/contribuir" className="btn-secondary text-base px-8 py-3">
                ✍️ Aportar una Canción
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 mt-12">
              <div className="text-center">
                <div className="font-heading font-black text-3xl text-gradient-gold">{allSongs.length}</div>
                <div className="text-beni-sand/60 text-sm font-body">Canciones</div>
              </div>
              <div className="w-px h-10 bg-beni-deep/60" />
              <div className="text-center">
                <div className="font-heading font-black text-3xl text-gradient-gold">{rhythms.length}</div>
                <div className="text-beni-sand/60 text-sm font-body">Ritmos</div>
              </div>
              <div className="w-px h-10 bg-beni-deep/60" />
              <div className="text-center">
                <div className="font-heading font-black text-3xl text-gradient-gold">🦜</div>
                <div className="text-beni-sand/60 text-sm font-body">Beni, Bolivia</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Filtros de categoría — componente cliente */}
      <section className="max-w-7xl mx-auto px-4 mb-8 pt-8">
        <CategoryFilter rhythms={rhythms} activeRhythm={rhythmFilter} activeQuery={query} />
      </section>

      {/* Grilla de canciones */}
      <section id="canciones" className="max-w-7xl mx-auto px-4 pb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            {query && (
              <h2 className="font-heading font-bold text-2xl text-beni-cream">
                🔍 Resultados para &ldquo;{q}&rdquo;
                {rhythmFilter && <span className="text-beni-gold"> · {rhythmFilter}</span>}
              </h2>
            )}
            {!query && rhythmFilter && (
              <h2 className="font-heading font-bold text-2xl text-beni-cream">
                🎶 {rhythmFilter}
              </h2>
            )}
            {!query && !rhythmFilter && (
              <h2 className="font-heading font-bold text-2xl text-beni-cream">
                🎼 Canciones Aprobadas
              </h2>
            )}
            <div className="decorative-line mt-2" />
          </div>
          <span className="text-beni-sand/50 text-sm font-body">
            {songs.length} {songs.length === 1 ? 'canción' : 'canciones'}
          </span>
        </div>

        {songs.length === 0 && (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🌿</div>
            <h3 className="font-heading text-xl text-beni-cream/70 mb-2">
              Sin resultados
            </h3>
            <p className="text-beni-sand/50 text-sm font-body mb-6">
              Prueba con otro término o categoría
            </p>
            <Link href="/" className="btn-secondary text-sm">
              Ver todas las canciones
            </Link>
          </div>
        )}

        {songs.length > 0 && <SongGrid songs={songs} />}
      </section>
    </div>
  )
}
