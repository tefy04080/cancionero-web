import Link from 'next/link'
import type { SongWithAuthor } from '@/lib/repositories/song.repository'

const RHYTHM_COLORS: Record<string, { bg: string; text: string; emoji: string }> = {
  Taquirari:      { bg: 'rgba(244,161,29,0.15)', text: '#f4a11d', emoji: '🎶' },
  Chovena:        { bg: 'rgba(30,107,138,0.2)',  text: '#2980b9', emoji: '🌊' },
  Macheteros:     { bg: 'rgba(199,75,42,0.2)',   text: '#e07050', emoji: '⚔️' },
  Sirilla:        { bg: 'rgba(82,183,136,0.2)',  text: '#52b788', emoji: '🌿' },
  Sarao:          { bg: 'rgba(160,82,45,0.2)',   text: '#d4a96a', emoji: '🌙' },
  'Baile del Monte': { bg: 'rgba(26,74,46,0.4)', text: '#86efac', emoji: '🌳' },
}

function getRhythmStyle(rhythm: string) {
  return RHYTHM_COLORS[rhythm] ?? { bg: 'rgba(82,183,136,0.15)', text: '#52b788', emoji: '🎵' }
}

function getYouTubeThumbnail(url: string): string {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/)
  if (match) return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`
  return ''
}

interface SongCardProps {
  song: SongWithAuthor
  index?: number
}

export default function SongCard({ song, index = 0 }: SongCardProps) {
  const rhythmStyle = getRhythmStyle(song.rhythmType)
  const thumbnail = getYouTubeThumbnail(song.youtubeUrl)
  const lyricsPreview = song.lyrics
    ? song.lyrics.slice(0, 120) + (song.lyrics.length > 120 ? '...' : '')
    : 'Sin letra registrada'

  return (
    <Link
      href={`/cancion/${song.id}`}
      id={`song-card-${song.id}`}
      className="glass-card glass-card-hover rounded-2xl overflow-hidden block group opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Thumbnail */}
      <div className="relative h-44 overflow-hidden bg-beni-dark">
        {thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnail}
            alt={song.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl"
            style={{ background: 'linear-gradient(135deg, #0d2818, #1a4a2e)' }}>
            🎵
          </div>
        )}
        {/* Overlay gradiente */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(7,26,15,0.8) 0%, transparent 60%)' }} />

        {/* Badge de ritmo */}
        <div className="absolute bottom-3 left-3">
          <span
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
            style={{ background: rhythmStyle.bg, color: rhythmStyle.text, border: `1px solid ${rhythmStyle.text}40` }}
          >
            {rhythmStyle.emoji} {song.rhythmType}
          </span>
        </div>

        {/* Play icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(244,161,29,0.9)', boxShadow: '0 0 20px rgba(244,161,29,0.5)' }}>
            <svg className="w-6 h-6 text-beni-dark ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4">
        <h3 className="font-heading font-bold text-beni-cream text-lg leading-tight mb-2 group-hover:text-beni-gold transition-colors line-clamp-1">
          {song.title}
        </h3>
        <p className="text-beni-sand/60 text-sm font-body leading-relaxed line-clamp-2 mb-3">
          {lyricsPreview}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          {song.author?.name ? (
            <span className="text-beni-light/60 text-xs flex items-center gap-1">
              <span>👤</span> {song.author.name}
            </span>
          ) : (
            <span className="text-beni-light/40 text-xs">Anónimo</span>
          )}
          <span className="text-beni-gold/60 text-xs flex items-center gap-1">
            Ver canción →
          </span>
        </div>
      </div>
    </Link>
  )
}
