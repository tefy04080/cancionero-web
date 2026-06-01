import { songRepository } from '@/lib/repositories/song.repository'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const song = await songRepository.getSongById(id)
  if (!song) return { title: 'Canción no encontrada' }
  return {
    title: `${song.title} (${song.rhythmType}) | Cancionero del Beni`,
    description: song.lyrics.slice(0, 160),
  }
}

function getYouTubeEmbedId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/)
  return match ? match[1] : null
}

export default async function SongDetailPage({ params }: Props) {
  const { id } = await params
  const song = await songRepository.getSongById(id)

  if (!song) notFound()

  const videoId = getYouTubeEmbedId(song.youtubeUrl)

  return (
    <div className="jungle-bg min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-beni-sand/50 mb-8 font-body">
          <Link href="/" className="hover:text-beni-gold transition-colors">Inicio</Link>
          <span>/</span>
          <span className="text-beni-cream/70">{song.title}</span>
        </div>

        {/* Header de la canción */}
        <div className="mb-8">
          <span className="rhythm-badge mb-3 inline-flex">
            🎵 {song.rhythmType}
          </span>
          <h1 className="font-heading font-black text-3xl md:text-4xl text-beni-cream mb-2">
            {song.title}
          </h1>
          {song.author?.name && (
            <p className="text-beni-sand/60 font-body text-sm">
              Aportado por <span className="text-beni-light">{song.author.name}</span>
            </p>
          )}
        </div>

        {/* Layout: Video + Letra */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Video de YouTube */}
          <div className="order-1">
            <div className="glass-card rounded-2xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
              {videoId ? (
                <iframe
                  id={`youtube-player-${song.id}`}
                  src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                  title={song.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-beni-sand/50">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🎬</div>
                    <p className="text-sm">Video no disponible</p>
                  </div>
                </div>
              )}
            </div>

            {/* Info adicional */}
            <div className="glass-card rounded-2xl p-5 mt-4">
              <h3 className="font-heading font-semibold text-beni-cream mb-3">
                🌿 Sobre este ritmo
              </h3>
              <p className="text-beni-sand/70 text-sm font-body leading-relaxed">
                {getRhythmDescription(song.rhythmType)}
              </p>
            </div>
          </div>

          {/* Letra */}
          <div className="order-2">
            <div className="glass-card rounded-2xl p-6 h-full">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-heading font-bold text-beni-cream text-xl">
                  📜 Letra
                </h2>
                <div className="decorative-line" />
              </div>
              <div className="lyrics-text font-body overflow-y-auto max-h-[500px] pr-2">
                {song.lyrics}
              </div>
            </div>
          </div>
        </div>

        {/* Botón volver */}
        <div className="mt-10 text-center">
          <Link href="/" className="btn-secondary inline-flex">
            ← Volver al Cancionero
          </Link>
        </div>
      </div>
    </div>
  )
}

function getRhythmDescription(rhythm: string): string {
  const descriptions: Record<string, string> = {
    Taquirari: 'El Taquirari es el ritmo más representativo del Oriente Boliviano. Su origen se remonta a la fusión de la música indígena con influencias españolas. Alegre y festivo, es el alma de las celebraciones benianas.',
    Chovena: 'La Chovena es una danza de origen Moxeño, de cadencia elegante y movimientos precisos. Se baila en festividades religiosas y culturales del Beni, con raíces en los pueblos originarios del Beni.',
    Macheteros: 'Los Macheteros es una danza guerrera del pueblo Tacana y otros pueblos originarios del Beni. Los danzantes se adornan con plumas de guacamaya y portan machetes, rindiendo homenaje a sus ancestros.',
    Sirilla: 'La Sirilla es un ritmo romántico y cadencioso del Oriente Boliviano. De influencia española y africana, se caracteriza por sus letras emotivas y su melodía nostálgica.',
    Sarao: 'El Sarao es una danza social del Beni que se baila en parejas. Heredero de los bailes de salón de la época colonial, fue adoptado y transformado por la cultura beniana.',
    'Baile del Monte': 'El Baile del Monte es una expresión artística de los pueblos originarios amazónicos del Beni. Celebra la conexión espiritual con la naturaleza y los ciclos de la selva.',
  }
  return descriptions[rhythm] ?? `El ${rhythm} es un ritmo tradicional del Departamento del Beni, parte invaluable del patrimonio cultural del Oriente Boliviano.`
}
