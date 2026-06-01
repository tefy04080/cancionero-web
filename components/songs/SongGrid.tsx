import type { SongWithAuthor } from '@/lib/repositories/song.repository'
import SongCard from './SongCard'

interface SongGridProps {
  songs: SongWithAuthor[]
}

export default function SongGrid({ songs }: SongGridProps) {
  if (songs.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="text-6xl mb-4">🌿</div>
        <h3 className="font-heading text-xl text-beni-cream/70 mb-2">
          No hay canciones todavía
        </h3>
        <p className="text-beni-sand/50 text-sm font-body">
          Sé el primero en aportar una canción del Beni
        </p>
      </div>
    )
  }

  return (
    <div
      id="song-grid"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
    >
      {songs.map((song, i) => (
        <SongCard key={song.id} song={song} index={i} />
      ))}
    </div>
  )
}
