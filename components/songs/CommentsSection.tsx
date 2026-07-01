'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'

interface Comment {
  id: string
  content: string
  createdAt: string
  author: {
    id: string
    name: string | null
    image: string | null
  }
}

interface Props {
  songId: string
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'ahora mismo'
  if (mins < 60) return `hace ${mins} min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `hace ${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 30) return `hace ${days}d`
  return new Date(dateStr).toLocaleDateString('es-BO', { day: 'numeric', month: 'short' })
}

export default function CommentsSection({ songId }: Props) {
  const { data: session } = useSession()
  const [comments, setComments] = useState<Comment[]>([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/songs/${songId}/comments`)
      .then(r => r.json())
      .then(data => { setComments(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [songId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim() || sending) return
    setSending(true)
    try {
      const res = await fetch(`/api/songs/${songId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text.trim() }),
      })
      if (res.ok) {
        const newComment = await res.json()
        setComments(prev => [newComment, ...prev])
        setText('')
        textareaRef.current?.blur()
      }
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="glass-card rounded-2xl p-6 mt-6">
      <h3 className="font-heading font-bold text-xl text-beni-cream mb-5 flex items-center gap-2">
        💬 Comentarios
        <span className="text-sm text-beni-sand/50 font-body font-normal">
          ({comments.length})
        </span>
      </h3>

      {/* Formulario para comentar */}
      {session ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-3">
            {session.user.image ? (
              <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-beni-gold/30 shrink-0 mt-1">
                <Image
                  src={session.user.image}
                  alt={session.user.name ?? 'Tu avatar'}
                  width={36}
                  height={36}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-9 h-9 rounded-full overflow-hidden bg-beni-deep flex items-center justify-center text-beni-gold font-bold shrink-0 mt-1">
                {session.user.name?.charAt(0) ?? '?'}
              </div>
            )}
            <div className="flex-1">
              <textarea
                ref={textareaRef}
                id="comment-input"
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Escribe un comentario sobre esta canción..."
                rows={2}
                maxLength={500}
                className="textarea-jungle text-sm resize-none"
                onKeyDown={e => {
                  if (e.key === 'Enter' && e.ctrlKey) handleSubmit(e as any)
                }}
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-beni-sand/30 text-xs">{text.length}/500 · Ctrl+Enter para enviar</span>
                <button
                  type="submit"
                  disabled={!text.trim() || sending}
                  className="btn-primary text-xs px-4 py-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {sending ? '⟳ Enviando...' : '✉️ Comentar'}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-6 p-4 rounded-xl text-center"
          style={{ background: 'rgba(13,40,24,0.4)', border: '1px dashed rgba(82,183,136,0.2)' }}>
          <p className="text-beni-sand/60 text-sm font-body mb-2">
            Inicia sesión para dejar un comentario
          </p>
          <Link href="/login" className="btn-secondary text-xs px-4 py-1.5">
            🔐 Iniciar sesión
          </Link>
        </div>
      )}

      {/* Lista de comentarios */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map(i => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-9 h-9 rounded-full bg-beni-deep/60 shrink-0" />
              <div className="flex-1">
                <div className="h-3 bg-beni-deep/60 rounded w-24 mb-2" />
                <div className="h-10 bg-beni-deep/40 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-3xl mb-2">🌿</div>
          <p className="text-beni-sand/40 text-sm font-body">Sé el primero en comentar esta canción</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map(comment => (
            <div key={comment.id} className="flex gap-3">
              {comment.author.image ? (
                <div className="w-9 h-9 rounded-full overflow-hidden border border-beni-deep/40 shrink-0 mt-0.5">
                  <Image
                    src={comment.author.image}
                    alt={comment.author.name ?? 'Usuario'}
                    width={36}
                    height={36}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-full overflow-hidden bg-beni-deep flex items-center justify-center text-beni-gold font-bold text-sm shrink-0 mt-0.5">
                  {comment.author.name?.charAt(0) ?? '?'}
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-beni-cream font-medium text-sm">
                    {comment.author.name ?? 'Anónimo'}
                  </span>
                  <span className="text-beni-sand/40 text-xs">{timeAgo(comment.createdAt)}</span>
                </div>
                <p className="text-beni-sand/80 text-sm font-body leading-relaxed whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
