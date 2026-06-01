'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import type { SongWithAuthor } from '@/lib/repositories/song.repository'

export default function ModeracionPage() {
  const { data: session } = useSession()
  const [songs, setSongs] = useState<SongWithAuthor[]>([])
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState<string | null>(null)

  useEffect(() => {
    fetchPending()
  }, [])

  async function fetchPending() {
    setLoading(true)
    try {
      const res = await fetch('/api/songs/pending')
      if (res.ok) {
        const data = await res.json()
        setSongs(data)
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleAction(id: string, status: 'APPROVED' | 'REJECTED') {
    setActionId(id)
    try {
      const res = await fetch('/api/songs/pending', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      if (res.ok) {
        setSongs(prev => prev.filter(s => s.id !== id))
      }
    } finally {
      setActionId(null)
    }
  }

  return (
    <div className="jungle-bg min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
            style={{ background: 'rgba(199,75,42,0.15)', border: '1px solid rgba(199,75,42,0.3)' }}>
            <span className="text-sm">🛡️</span>
            <span className="text-beni-terra text-sm font-medium font-body">Panel de Moderación</span>
          </div>

          <h1 className="font-heading font-black text-3xl md:text-4xl text-beni-cream mb-2">
            Revisión de Canciones
          </h1>
          <div className="decorative-line" />

          {session?.user && (
            <p className="text-beni-sand/60 text-sm font-body mt-3">
              Sesión activa: <span className="text-beni-light">{session.user.name}</span>
              {' '}·{' '}
              <span className="rhythm-badge text-xs">{session.user.role}</span>
            </p>
          )}
        </div>

        {/* Contenido */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="glass-card rounded-2xl p-6 animate-pulse">
                <div className="h-5 bg-beni-deep/60 rounded w-1/3 mb-3" />
                <div className="h-3 bg-beni-deep/40 rounded w-1/4 mb-4" />
                <div className="h-16 bg-beni-deep/30 rounded" />
              </div>
            ))}
          </div>
        ) : songs.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="font-heading font-bold text-xl text-beni-cream mb-2">
              ¡Todo al día!
            </h3>
            <p className="text-beni-sand/60 font-body text-sm">
              No hay canciones pendientes de revisión en este momento.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-beni-sand/60 text-sm font-body mb-6">
              {songs.length} canción{songs.length !== 1 ? 'es' : ''} pendiente{songs.length !== 1 ? 's' : ''} de revisión
            </p>

            {songs.map(song => (
              <div key={song.id} id={`mod-card-${song.id}`}
                className="glass-card rounded-2xl p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-heading font-bold text-beni-cream text-lg truncate">
                        {song.title}
                      </h3>
                      <span className="rhythm-badge text-xs shrink-0">{song.rhythmType}</span>
                    </div>
                    <p className="text-beni-sand/50 text-xs font-body">
                      Por: {song.author?.name ?? 'Anónimo'} · {new Date(song.createdAt).toLocaleDateString('es-BO')}
                    </p>
                  </div>

                  {/* Acciones */}
                  <div className="flex gap-2 shrink-0">
                    <button
                      id={`approve-${song.id}`}
                      onClick={() => handleAction(song.id, 'APPROVED')}
                      disabled={actionId === song.id}
                      className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
                      style={{
                        background: 'rgba(82,183,136,0.2)',
                        border: '1px solid rgba(82,183,136,0.4)',
                        color: '#52b788'
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(82,183,136,0.35)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'rgba(82,183,136,0.2)')}
                    >
                      {actionId === song.id ? '⟳' : '✓'} Aprobar
                    </button>
                    <button
                      id={`reject-${song.id}`}
                      onClick={() => handleAction(song.id, 'REJECTED')}
                      disabled={actionId === song.id}
                      className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
                      style={{
                        background: 'rgba(199,75,42,0.2)',
                        border: '1px solid rgba(199,75,42,0.4)',
                        color: '#e07050'
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(199,75,42,0.35)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'rgba(199,75,42,0.2)')}
                    >
                      {actionId === song.id ? '⟳' : '✗'} Rechazar
                    </button>
                  </div>
                </div>

                {/* URL */}
                <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg"
                  style={{ background: 'rgba(13,40,24,0.5)' }}>
                  <span className="text-beni-terra text-xs">🎬</span>
                  <a href={song.youtubeUrl} target="_blank" rel="noopener noreferrer"
                    className="text-beni-river text-xs font-body hover:text-beni-water transition-colors truncate">
                    {song.youtubeUrl}
                  </a>
                </div>

                {/* Letra (preview) */}
                <div className="px-3 py-3 rounded-xl"
                  style={{ background: 'rgba(13,40,24,0.4)' }}>
                  <p className="text-beni-sand/60 text-xs font-body whitespace-pre-line leading-relaxed line-clamp-4">
                    {song.lyrics}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
