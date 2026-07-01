'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const RHYTHM_OPTIONS = [
  'Taquirari', 'Chovena', 'Macheteros', 'Sirilla',
  'Sarao', 'Baile del Monte', 'Carnavalito', 'Otro',
]

interface SongData {
  id: string
  title: string
  authorName?: string | null
  youtubeUrl: string
  rhythmType: string
  lyrics?: string | null
}

interface Props {
  song: SongData
}

export default function AdminSongActions({ song }: Props) {
  const router = useRouter()

  const isKnownRhythm = RHYTHM_OPTIONS.slice(0, -1).includes(song.rhythmType)

  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [form, setForm] = useState({
    title: song.title,
    authorName: song.authorName ?? '',
    youtubeUrl: song.youtubeUrl,
    rhythmType: isKnownRhythm ? song.rhythmType : 'Otro',
    customRhythm: isKnownRhythm ? '' : song.rhythmType,
    lyrics: song.lyrics ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const rhythmType = form.rhythmType === 'Otro'
      ? form.customRhythm.trim()
      : form.rhythmType

    if (!rhythmType) {
      setError('Escribe el nombre del ritmo')
      return
    }

    setSaving(true)
    try {
      const res = await fetch(`/api/songs/${song.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          authorName: form.authorName || null,
          youtubeUrl: form.youtubeUrl,
          rhythmType,
          lyrics: form.lyrics || null,
        }),
      })

      if (res.ok) {
        setShowEdit(false)
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error ?? 'Error al guardar cambios')
      }
    } catch {
      setError('Error de conexión')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    setError('')
    try {
      const res = await fetch(`/api/songs/${song.id}`, { method: 'DELETE' })
      if (res.ok) {
        router.push('/')
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error ?? 'Error al eliminar')
        setShowDelete(false)
      }
    } catch {
      setError('Error de conexión')
      setShowDelete(false)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      {/* Barra de acciones admin */}
      <div
        className="flex flex-wrap items-center gap-2 mb-6 px-4 py-2.5 rounded-2xl"
        style={{
          background: 'rgba(244,161,29,0.05)',
          border: '1px solid rgba(244,161,29,0.18)',
        }}
      >
        <span className="text-beni-gold/50 text-xs font-body flex items-center gap-1">
          ⚙️ <span>Panel Admin</span>
        </span>
        <div className="flex-1" />
        <button
          id="edit-song-btn"
          onClick={() => { setError(''); setShowEdit(true) }}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all hover:opacity-80 active:scale-95"
          style={{
            background: 'rgba(82,183,136,0.12)',
            border: '1px solid rgba(82,183,136,0.30)',
            color: '#52b788',
          }}
        >
          ✏️ Editar canción
        </button>
        <button
          id="delete-song-btn"
          onClick={() => { setError(''); setShowDelete(true) }}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all hover:opacity-80 active:scale-95"
          style={{
            background: 'rgba(239,68,68,0.10)',
            border: '1px solid rgba(239,68,68,0.28)',
            color: '#ef4444',
          }}
        >
          🗑️ Eliminar
        </button>
      </div>

      {/* ─── Modal de edición ─── */}
      {showEdit && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(6px)' }}
        >
          <div className="glass-card rounded-3xl p-6 md:p-8 w-full max-w-2xl max-h-[92vh] overflow-y-auto">
            {/* Cabecera */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading font-black text-xl text-beni-cream flex items-center gap-2">
                ✏️ Editar Canción
              </h2>
              <button
                onClick={() => setShowEdit(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-beni-sand/50 hover:text-beni-cream hover:bg-beni-deep transition-all text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              {/* Autor */}
              <div>
                <label className="block text-beni-cream font-medium mb-1.5 font-body text-sm">
                  🎤 Autor / Compositor
                  <span className="text-beni-sand/40 font-normal ml-1">(opcional)</span>
                </label>
                <input
                  name="authorName"
                  value={form.authorName}
                  onChange={handleChange}
                  placeholder="Ej: Gilberto Rojas..."
                  className="input-jungle"
                />
              </div>

              {/* Título */}
              <div>
                <label className="block text-beni-cream font-medium mb-1.5 font-body text-sm">
                  📝 Título <span className="text-beni-terra">*</span>
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="input-jungle"
                />
              </div>

              {/* YouTube */}
              <div>
                <label className="block text-beni-cream font-medium mb-1.5 font-body text-sm">
                  🎬 Enlace de YouTube <span className="text-beni-terra">*</span>
                </label>
                <input
                  name="youtubeUrl"
                  value={form.youtubeUrl}
                  onChange={handleChange}
                  required
                  className="input-jungle"
                />
              </div>

              {/* Ritmo */}
              <div>
                <label className="block text-beni-cream font-medium mb-1.5 font-body text-sm">
                  🥁 Ritmo <span className="text-beni-terra">*</span>
                </label>
                <div className="relative">
                  <select
                    name="rhythmType"
                    value={form.rhythmType}
                    onChange={handleChange}
                    className="select-jungle"
                  >
                    {RHYTHM_OPTIONS.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-beni-sand/50 pointer-events-none">▾</span>
                </div>
                {form.rhythmType === 'Otro' && (
                  <input
                    name="customRhythm"
                    value={form.customRhythm}
                    onChange={handleChange}
                    placeholder="Escribe el nombre del ritmo..."
                    className="input-jungle mt-2"
                    autoFocus
                  />
                )}
              </div>

              {/* Letra */}
              <div>
                <label className="block text-beni-cream font-medium mb-1.5 font-body text-sm">
                  📜 Letra
                  <span className="text-beni-sand/40 font-normal ml-1">(opcional)</span>
                </label>
                <textarea
                  name="lyrics"
                  value={form.lyrics}
                  onChange={handleChange}
                  rows={9}
                  maxLength={5000}
                  placeholder="Letra de la canción..."
                  className="textarea-jungle"
                />
                <div className="text-right text-beni-sand/40 text-xs mt-1">
                  {form.lyrics.length}/5000
                </div>
              </div>

              {error && (
                <p className="text-red-400 text-sm flex items-center gap-1">
                  ⚠️ {error}
                </p>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowEdit(false)}
                  className="btn-secondary flex-1 justify-center"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex-1 justify-center disabled:opacity-60"
                >
                  {saving ? <><span className="animate-spin">⟳</span> Guardando...</> : '✅ Guardar cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Dialog de confirmación para eliminar ─── */}
      {showDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(6px)' }}
        >
          <div className="glass-card rounded-3xl p-8 max-w-sm w-full text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="font-heading font-bold text-xl text-beni-cream mb-3">
              ¿Eliminar esta canción?
            </h3>
            <p className="text-beni-sand/60 text-sm font-body mb-2">
              Esta acción es <span className="text-red-400 font-semibold">irreversible</span>.
              Se eliminarán también todos sus comentarios y likes.
            </p>
            <p className="text-beni-gold font-semibold text-base mb-6 px-2">
              "{song.title}"
            </p>

            {error && (
              <p className="text-red-400 text-sm mb-4">⚠️ {error}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowDelete(false)}
                className="btn-secondary flex-1 justify-center"
              >
                Cancelar
              </button>
              <button
                id="confirm-delete-btn"
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl font-semibold text-sm disabled:opacity-60 transition-all hover:opacity-90"
                style={{
                  background: 'rgba(239,68,68,0.15)',
                  border: '1px solid rgba(239,68,68,0.40)',
                  color: '#ef4444',
                }}
              >
                {deleting ? <><span className="animate-spin">⟳</span> Eliminando...</> : '🗑️ Sí, eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
