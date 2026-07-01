'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import type { SongWithAuthor } from '@/lib/repositories/song.repository'

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/)
  return match ? match[1] : null
}

export default function ModeracionPage() {
  const { data: session } = useSession()
  const [songs, setSongs] = useState<SongWithAuthor[]>([])
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

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
        // Auto-expandir el primero si solo hay uno
        if (data.length === 1) setExpandedId(data[0].id)
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
        if (expandedId === id) setExpandedId(null)
      }
    } finally {
      setActionId(null)
    }
  }

  return (
    <div className="jungle-bg min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">

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
              <span className="rhythm-badge text-xs">{(session.user as any).role}</span>
            </p>
          )}
        </div>

        {/* Contenido */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="glass-card rounded-2xl p-6 animate-pulse">
                <div className="h-5 bg-beni-deep/60 rounded w-1/3 mb-3" />
                <div className="h-3 bg-beni-deep/40 rounded w-1/4 mb-4" />
                <div className="h-40 bg-beni-deep/30 rounded" />
              </div>
            ))}
          </div>
        ) : songs.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="font-heading font-bold text-xl text-beni-cream mb-2">¡Todo al día!</h3>
            <p className="text-beni-sand/60 font-body text-sm">
              No hay canciones pendientes de revisión en este momento.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-beni-sand/60 text-sm font-body">
              {songs.length} canción{songs.length !== 1 ? 'es' : ''} pendiente{songs.length !== 1 ? 's' : ''} de revisión
            </p>

            {songs.map(song => {
              const videoId = getYouTubeId(song.youtubeUrl)
              const authorName = (song as any).authorName
              const isExpanded = expandedId === song.id

              return (
                <div key={song.id} id={`mod-card-${song.id}`}
                  className="glass-card rounded-2xl overflow-hidden">

                  {/* ── Cabecera de la tarjeta ── */}
                  <div className="p-5 flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-heading font-bold text-beni-cream text-xl">
                          {song.title}
                        </h3>
                        <span className="rhythm-badge text-xs shrink-0">{song.rhythmType}</span>
                      </div>

                      {/* Autor / Compositor */}
                      {authorName && (
                        <p className="text-beni-gold/80 text-sm font-medium mb-0.5">
                          🎤 Compositor: {authorName}
                        </p>
                      )}

                      <p className="text-beni-sand/50 text-xs font-body">
                        Enviado por: <span className="text-beni-light/70">{song.author?.name ?? 'Anónimo'}</span>
                        {' '}· {new Date(song.createdAt).toLocaleDateString('es-BO', {
                          day: 'numeric', month: 'long', year: 'numeric'
                        })}
                      </p>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex gap-2 shrink-0 flex-wrap justify-end">
                      <button
                        id={`approve-${song.id}`}
                        onClick={() => handleAction(song.id, 'APPROVED')}
                        disabled={actionId === song.id}
                        className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 hover:opacity-80"
                        style={{ background: 'rgba(82,183,136,0.2)', border: '1px solid rgba(82,183,136,0.4)', color: '#52b788' }}
                      >
                        {actionId === song.id ? '⟳' : '✓'} Aprobar
                      </button>
                      <button
                        id={`reject-${song.id}`}
                        onClick={() => handleAction(song.id, 'REJECTED')}
                        disabled={actionId === song.id}
                        className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 hover:opacity-80"
                        style={{ background: 'rgba(199,75,42,0.2)', border: '1px solid rgba(199,75,42,0.4)', color: '#e07050' }}
                      >
                        {actionId === song.id ? '⟳' : '✗'} Rechazar
                      </button>
                    </div>
                  </div>

                  {/* ── Enlace YouTube ── */}
                  <div className="px-5 mb-4">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
                      style={{ background: 'rgba(13,40,24,0.5)' }}>
                      <span className="text-beni-terra text-xs">🎬</span>
                      <a href={song.youtubeUrl} target="_blank" rel="noopener noreferrer"
                        className="text-beni-river text-xs font-body hover:text-beni-water transition-colors break-all">
                        {song.youtubeUrl}
                      </a>
                    </div>
                  </div>

                  {/* ── Video embed ── */}
                  {videoId && (
                    <div className="px-5 mb-4">
                      <div className="rounded-xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
                        <iframe
                          src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                          title={song.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                        />
                      </div>
                    </div>
                  )}

                  {/* ── Letra completa ── */}
                  <div className="px-5 pb-5">
                    <div className="rounded-xl overflow-hidden"
                      style={{ background: 'rgba(13,40,24,0.5)', border: '1px solid rgba(82,183,136,0.1)' }}>

                      {/* Header de letra con toggle */}
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : song.id)}
                        className="w-full flex items-center justify-between px-4 py-3 text-left hover:opacity-80 transition-opacity"
                      >
                        <span className="text-beni-cream font-medium text-sm flex items-center gap-2">
                          📜 Letra de la canción
                          {!song.lyrics && (
                            <span className="text-beni-sand/40 font-normal text-xs">(sin letra)</span>
                          )}
                        </span>
                        <span className="text-beni-sand/50 text-xs">
                          {isExpanded ? '▲ Ocultar' : '▼ Ver completa'}
                        </span>
                      </button>

                      {/* Letra siempre visible (preview 4 líneas) */}
                      {!isExpanded && song.lyrics && (
                        <div className="px-4 pb-3">
                          <p className="text-beni-sand/60 text-sm font-body whitespace-pre-line leading-relaxed line-clamp-4">
                            {song.lyrics}
                          </p>
                        </div>
                      )}

                      {/* Letra completa expandida */}
                      {isExpanded && (
                        <div className="px-4 pb-4">
                          {song.lyrics ? (
                            <p className="text-beni-sand/80 text-sm font-body whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto pr-1">
                              {song.lyrics}
                            </p>
                          ) : (
                            <p className="text-beni-sand/40 text-sm italic">
                              El usuario no proporcionó la letra de esta canción.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
