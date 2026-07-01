'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { contributeSongSchema, type ContributeSongInput } from '@/lib/validators/song.schema'

const RHYTHM_OPTIONS = [
  'Taquirari',
  'Chovena',
  'Macheteros',
  'Sirilla',
  'Sarao',
  'Baile del Monte',
  'Carnavalito',
  'Otro',
]

export default function ContribuirPage() {
  const { data: session } = useSession()
  const router = useRouter()

  const [form, setForm] = useState({
    title: '',
    authorName: '',
    youtubeUrl: '',
    rhythmType: '',
    customRhythm: '',   // para cuando selecciona "Otro"
    lyrics: '',
  })
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Resolver el ritmo: si eligió "Otro", usar el texto personalizado
    const rhythmType = form.rhythmType === 'Otro'
      ? form.customRhythm.trim()
      : form.rhythmType

    if (form.rhythmType === 'Otro' && !rhythmType) {
      setErrors(prev => ({ ...prev, customRhythm: 'Escribe el nombre del ritmo' }))
      return
    }

    const payload: ContributeSongInput = {
      title: form.title,
      authorName: form.authorName || undefined,
      youtubeUrl: form.youtubeUrl,
      rhythmType,
      lyrics: form.lyrics || undefined,
    }

    const validation = contributeSongSchema.safeParse(payload)
    if (!validation.success) {
      const fieldErrors: Partial<Record<string, string>> = {}
      for (const issue of validation.error.issues) {
        const field = String(issue.path[0])
        fieldErrors[field] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/songs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        setSuccess(true)
        setTimeout(() => router.push('/'), 3000)
      } else {
        const data = await res.json()
        console.error('Error:', data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="jungle-bg min-h-screen flex items-center justify-center px-4">
        <div className="glass-card rounded-3xl p-12 text-center max-w-md">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="font-heading font-bold text-2xl text-beni-cream mb-2">
            ¡Gracias por tu aporte!
          </h2>
          <p className="text-beni-sand/70 font-body mb-6">
            Tu canción ha sido enviada para revisión. Los moderadores la revisarán pronto.
          </p>
          <div className="flex gap-2 justify-center">
            <div className="w-2 h-2 rounded-full bg-beni-gold animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-beni-gold animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-beni-gold animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <p className="text-beni-sand/50 text-sm mt-4">Redirigiendo al cancionero...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="jungle-bg min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">🎵</div>
          <h1 className="font-heading font-black text-3xl md:text-4xl text-beni-cream mb-3">
            Aportar una Canción
          </h1>
          <p className="text-beni-sand/70 font-body mb-5">
            Comparte la música tradicional de nuestra tierra beniana con la comunidad.
          </p>

          {session?.user && (
            <div className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card">
              <span className="text-sm">👤</span>
              <span className="text-beni-light text-sm font-body">
                Aportando como <strong>{session.user.name}</strong>
              </span>
            </div>
          )}

          {/* Botón Tutorial Instagram */}
          <div>
            <a
              id="instagram-tutorial-btn"
              href="https://www.instagram.com/p/DaRAsJFFFSt/?igsh=MWUyN201enV0ZzF0bA=="
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl font-semibold text-sm transition-all hover:scale-105 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)',
                color: '#fff',
                boxShadow: '0 4px 20px rgba(253,29,29,0.25)',
              }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
              📖 Tutorial: Cómo subir una canción
            </a>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-6 md:p-8 space-y-6">

          {/* 1. Autor / Compositor */}
          <div>
            <label htmlFor="authorName" className="block text-beni-cream font-medium mb-2 font-body text-sm">
              🎤 Autor o Compositor
              <span className="text-beni-sand/40 font-normal ml-1">(opcional)</span>
            </label>
            <input
              id="authorName"
              name="authorName"
              type="text"
              value={form.authorName}
              onChange={handleChange}
              placeholder="Ej: Gilberto Rojas, Autora desconocida..."
              className={`input-jungle ${errors.authorName ? 'border-beni-terra/60' : ''}`}
            />
            {errors.authorName && (
              <p className="text-beni-terra text-xs mt-1 flex items-center gap-1">
                <span>⚠️</span> {errors.authorName}
              </p>
            )}
          </div>

          {/* 2. Título */}
          <div>
            <label htmlFor="title" className="block text-beni-cream font-medium mb-2 font-body text-sm">
              📝 Título de la canción <span className="text-beni-terra">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="Ej: Tierra Beniana"
              className={`input-jungle ${errors.title ? 'border-beni-terra/60' : ''}`}
            />
            {errors.title && (
              <p className="text-beni-terra text-xs mt-1 flex items-center gap-1">
                <span>⚠️</span> {errors.title}
              </p>
            )}
          </div>

          {/* 3. URL de YouTube */}
          <div>
            <label htmlFor="youtubeUrl" className="block text-beni-cream font-medium mb-2 font-body text-sm">
              🎬 Enlace de YouTube <span className="text-beni-terra">*</span>
            </label>
            <input
              id="youtubeUrl"
              name="youtubeUrl"
              type="url"
              value={form.youtubeUrl}
              onChange={handleChange}
              placeholder="https://www.youtube.com/watch?v=..."
              className={`input-jungle ${errors.youtubeUrl ? 'border-beni-terra/60' : ''}`}
            />

            {/* Botón Buscar en YouTube */}
            <div className="flex items-center justify-between mt-2">
              <div>
                {errors.youtubeUrl && (
                  <p className="text-beni-terra text-xs flex items-center gap-1">
                    <span>⚠️</span> {errors.youtubeUrl}
                  </p>
                )}
              </div>
              <a
                id="search-youtube-btn"
                href={
                  form.title.trim()
                    ? `https://www.youtube.com/results?search_query=${encodeURIComponent(form.title.trim())}`
                    : 'https://www.youtube.com'
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-xs transition-all hover:scale-105 active:scale-95 shrink-0"
                style={{
                  background: '#FF0000',
                  color: '#fff',
                  boxShadow: '0 2px 12px rgba(255,0,0,0.30)',
                }}
              >
                {/* YouTube logo SVG */}
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                Buscar en YouTube
              </a>
            </div>
          </div>

          {/* 4. Ritmo */}
          <div>
            <label htmlFor="rhythmType" className="block text-beni-cream font-medium mb-2 font-body text-sm">
              🥁 Ritmo Cultural <span className="text-beni-terra">*</span>
            </label>
            <div className="relative">
              <select
                id="rhythmType"
                name="rhythmType"
                value={form.rhythmType}
                onChange={handleChange}
                className={`select-jungle ${errors.rhythmType ? 'border-beni-terra/60' : ''}`}
              >
                <option value="">Selecciona el ritmo...</option>
                {RHYTHM_OPTIONS.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-beni-sand/50 pointer-events-none">▾</span>
            </div>
            {errors.rhythmType && (
              <p className="text-beni-terra text-xs mt-1 flex items-center gap-1">
                <span>⚠️</span> {errors.rhythmType}
              </p>
            )}

            {/* Campo adicional si selecciona "Otro" */}
            {form.rhythmType === 'Otro' && (
              <div className="mt-3">
                <label htmlFor="customRhythm" className="block text-beni-light text-xs mb-1 font-body">
                  ✍️ Escribe el nombre del ritmo <span className="text-beni-terra">*</span>
                </label>
                <input
                  id="customRhythm"
                  name="customRhythm"
                  type="text"
                  value={form.customRhythm}
                  onChange={handleChange}
                  placeholder="Ej: Polca Beniana, Joropo, Cumbia..."
                  className={`input-jungle ${errors.customRhythm ? 'border-beni-terra/60' : ''}`}
                  autoFocus
                />
                {errors.customRhythm && (
                  <p className="text-beni-terra text-xs mt-1 flex items-center gap-1">
                    <span>⚠️</span> {errors.customRhythm}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* 5. Letra (Opcional) */}
          <div>
            <label htmlFor="lyrics" className="block text-beni-cream font-medium mb-2 font-body text-sm">
              📜 Letra de la canción
              <span className="text-beni-sand/40 font-normal ml-1">(opcional)</span>
            </label>
            <textarea
              id="lyrics"
              name="lyrics"
              value={form.lyrics}
              onChange={handleChange}
              placeholder="Escribe aquí la letra de la canción... (puedes dejarlo vacío si no la conoces)"
              rows={10}
              className={`textarea-jungle ${errors.lyrics ? 'border-beni-terra/60' : ''}`}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.lyrics ? (
                <p className="text-beni-terra text-xs flex items-center gap-1">
                  <span>⚠️</span> {errors.lyrics}
                </p>
              ) : (
                <p className="text-beni-sand/40 text-xs">
                  Si no conoces la letra, puedes dejar este campo vacío
                </p>
              )}
              <span className="text-beni-sand/40 text-xs">{form.lyrics.length}/5000</span>
            </div>
          </div>

          {/* Aviso */}
          <div className="flex items-start gap-3 px-4 py-3 rounded-xl"
            style={{ background: 'rgba(244,161,29,0.08)', border: '1px solid rgba(244,161,29,0.2)' }}>
            <span className="text-lg">ℹ️</span>
            <p className="text-beni-sand/70 text-sm font-body">
              Tu aporte será revisado por nuestros moderadores antes de aparecer en el cancionero.
              Gracias por preservar la cultura del Beni.
            </p>
          </div>

          {/* Botón */}
          <button
            id="submit-song-button"
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center text-base py-3 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <><span className="animate-spin">⟳</span> Enviando...</>
            ) : (
              <>🌿 Enviar para Revisión</>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
