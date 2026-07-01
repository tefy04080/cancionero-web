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
          <p className="text-beni-sand/70 font-body">
            Comparte la música tradicional de nuestra tierra beniana con la comunidad.
          </p>
          {session?.user && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card">
              <span className="text-sm">👤</span>
              <span className="text-beni-light text-sm font-body">
                Aportando como <strong>{session.user.name}</strong>
              </span>
            </div>
          )}
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
            {errors.youtubeUrl && (
              <p className="text-beni-terra text-xs mt-1 flex items-center gap-1">
                <span>⚠️</span> {errors.youtubeUrl}
              </p>
            )}
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
