'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface Props {
  songId: string
}

export default function LikeButton({ songId }: Props) {
  const { data: session } = useSession()
  const [liked, setLiked] = useState(false)
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetch(`/api/songs/${songId}/like`)
      .then(r => r.json())
      .then(data => {
        setLiked(data.liked)
        setCount(data.count)
      })
  }, [songId])

  const handleLike = async () => {
    if (!session) return
    setLoading(true)
    try {
      const res = await fetch(`/api/songs/${songId}/like`, { method: 'POST' })
      const data = await res.json()
      setLiked(data.liked)
      setCount(data.count)
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <div className="flex items-center gap-3">
      {session ? (
        <button
          id="like-button"
          onClick={handleLike}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-medium text-sm transition-all duration-200 disabled:opacity-60"
          style={{
            background: liked
              ? 'rgba(239,68,68,0.15)'
              : 'rgba(13,40,24,0.6)',
            border: liked
              ? '1px solid rgba(239,68,68,0.4)'
              : '1px solid rgba(82,183,136,0.25)',
            color: liked ? '#ef4444' : '#a3c4bc',
            transform: loading ? 'scale(0.96)' : 'scale(1)',
          }}
          onMouseEnter={e => {
            if (!liked) {
              e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'
              e.currentTarget.style.color = '#ef4444'
            }
          }}
          onMouseLeave={e => {
            if (!liked) {
              e.currentTarget.style.borderColor = 'rgba(82,183,136,0.25)'
              e.currentTarget.style.color = '#a3c4bc'
            }
          }}
        >
          <span className="text-lg transition-transform duration-200" style={{
            transform: liked ? 'scale(1.2)' : 'scale(1)',
          }}>
            {liked ? '❤️' : '🤍'}
          </span>
          <span>{count} {count === 1 ? 'Me gusta' : 'Me gusta'}</span>
        </button>
      ) : (
        <Link
          href="/login"
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-medium text-sm text-beni-sand/50 hover:text-beni-cream transition-colors"
          style={{ border: '1px solid rgba(82,183,136,0.15)' }}
        >
          <span>🤍</span>
          <span>{count} Me gusta · Inicia sesión</span>
        </Link>
      )}
    </div>
  )
}
