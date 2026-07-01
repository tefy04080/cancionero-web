'use client'

import { useState } from 'react'

interface Props {
  videoId: string
  title: string
}

export default function DownloadButton({ videoId, title }: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleDownload = async () => {
    setStatus('loading')
    setErrorMsg('')

    try {
      // Verificar que el endpoint responde antes de redirigir
      const checkRes = await fetch(`/api/download?videoId=${videoId}`, {
        method: 'GET',
        headers: { Accept: 'video/mp4,*/*' },
      })

      if (!checkRes.ok) {
        const err = await checkRes.json().catch(() => ({ error: 'Error desconocido' }))
        throw new Error(err.error ?? 'Error al descargar')
      }

      // Leer el stream y crear un blob para descarga directa
      const blob = await checkRes.blob()
      const blobUrl = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = blobUrl
      link.download = `${title}.mp4`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Liberar la URL del blob después de un momento
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000)

      setStatus('idle')
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.message ?? 'No se pudo descargar. Intenta de nuevo.')
      setStatus('error')
      setTimeout(() => {
        setStatus('idle')
        setErrorMsg('')
      }, 5000)
    }
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        id="download-button"
        onClick={handleDownload}
        disabled={status === 'loading'}
        className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-medium text-sm transition-all duration-200 disabled:cursor-wait"
        style={{
          background: status === 'error'
            ? 'rgba(255,0,0,0.15)'
            : status === 'loading'
              ? 'rgba(255,165,0,0.08)'
              : 'rgba(255,0,0,0.08)',
          border: `1px solid ${status === 'error' ? 'rgba(255,0,0,0.4)' : 'rgba(255,0,0,0.25)'}`,
          color: status === 'loading' ? '#ffa500' : '#ff6b6b',
          opacity: status === 'loading' ? 0.7 : 1,
        }}
      >
        {status === 'loading' ? (
          <>
            <span className="inline-block animate-spin">⟳</span>
            Descargando... (puede tardar)
          </>
        ) : status === 'error' ? (
          <>⚠️ Error — Reintentar</>
        ) : (
          <>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 16l-5-5h3V4h4v7h3l-5 5zm-7 2v2h14v-2H5z" />
            </svg>
            Descargar Video
          </>
        )}
      </button>

      {status === 'loading' && (
        <p className="text-beni-sand/40 text-xs ml-1">
          Extrayendo el video de YouTube...
        </p>
      )}
      {errorMsg && (
        <p className="text-red-400/80 text-xs ml-1">{errorMsg}</p>
      )}
    </div>
  )
}
