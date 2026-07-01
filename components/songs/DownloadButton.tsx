'use client'

interface Props {
  youtubeUrl: string
}

export default function DownloadButton({ youtubeUrl }: Props) {
  return (
    <a
      id="download-button"
      href={youtubeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-medium text-sm transition-all duration-200 download-btn"
      style={{
        background: 'rgba(255,0,0,0.08)',
        border: '1px solid rgba(255,0,0,0.25)',
        color: '#ff6b6b',
      }}
    >
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 16l-5-5h3V4h4v7h3l-5 5zm-7 2v2h14v-2H5z" />
      </svg>
      Descargar / Ver en YouTube
    </a>
  )
}
