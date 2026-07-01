'use client'

interface Props {
  youtubeUrl: string
}

/**
 * Convierte una URL de YouTube a ssyoutube.com para descarga directa via SaveFrom.net
 * Ejemplo: https://www.youtube.com/watch?v=ABC → https://ssyoutube.com/watch?v=ABC
 */
function toSaveFromUrl(youtubeUrl: string): string {
  // Eliminar parámetros innecesarios y quedarse con el video ID
  try {
    const urlObj = new URL(youtubeUrl)
    const videoId = urlObj.searchParams.get('v')

    if (videoId) {
      // Formato limpio: ssyoutube.com/watch?v=VIDEO_ID
      return `https://ssyoutube.com/watch?v=${videoId}`
    }
  } catch {
    // Si falla el parseo, usar el reemplazo simple
  }

  // Reemplazo directo como fallback
  return youtubeUrl
    .replace('https://www.youtube.com', 'https://ssyoutube.com')
    .replace('http://www.youtube.com', 'https://ssyoutube.com')
    .replace('https://youtube.com', 'https://ssyoutube.com')
    .replace('https://youtu.be/', 'https://ssyoutube.com/watch?v=')
}

export default function DownloadButton({ youtubeUrl }: Props) {
  const saveFromUrl = toSaveFromUrl(youtubeUrl)

  const handleDownload = () => {
    window.open(saveFromUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <button
      id="download-button"
      onClick={handleDownload}
      className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-medium text-sm transition-all duration-200 hover:opacity-90 active:scale-95"
      style={{
        background: 'rgba(255,80,80,0.10)',
        border: '1px solid rgba(255,80,80,0.30)',
        color: '#ff6b6b',
        cursor: 'pointer',
      }}
      title={`Descargar desde SaveFrom.net`}
    >
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 16l-5-5h3V4h4v7h3l-5 5zm-7 2v2h14v-2H5z" />
      </svg>
      Descargar Video
    </button>
  )
}
