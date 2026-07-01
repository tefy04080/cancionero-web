import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

// Extrae el ID de YouTube de la URL
function extractVideoId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/)
  return match ? match[1] : null
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const videoId = searchParams.get('videoId')

  if (!videoId || videoId.length !== 11) {
    return NextResponse.json({ error: 'ID de video inválido' }, { status: 400 })
  }

  try {
    // Importación dinámica para evitar problemas en edge runtime
    const ytdl = (await import('@distube/ytdl-core')).default

    const url = `https://www.youtube.com/watch?v=${videoId}`

    // Obtener info del video
    const info = await ytdl.getInfo(url)
    const videoTitle = info.videoDetails.title
      .replace(/[/\\?%*:|"<>]/g, '-')
      .trim()

    // Elegir el mejor formato mp4 con audio y video (max 720p para no sobrecargar)
    const formats = info.formats.filter(f =>
      f.hasVideo && f.hasAudio && f.container === 'mp4'
    )

    // Ordenar por calidad: preferir 720p o la más alta disponible
    const sorted = formats.sort((a, b) => {
      const qA = parseInt(a.qualityLabel ?? '0') || 0
      const qB = parseInt(b.qualityLabel ?? '0') || 0
      return qB - qA
    })

    const format = sorted[0]

    if (!format?.url) {
      // Fallback: cualquier formato con audio y video
      const fallback = ytdl.chooseFormat(info.formats, {
        quality: 'lowestvideo',
        filter: 'audioandvideo',
      })
      if (!fallback?.url) {
        return NextResponse.json(
          { error: 'No se encontró un formato descargable' },
          { status: 404 }
        )
      }
    }

    const videoUrl = format?.url ?? ytdl.chooseFormat(info.formats, { filter: 'audioandvideo' }).url

    // Stream el video desde YouTube CDN a través de nuestra API
    const response = await fetch(videoUrl, {
      headers: {
        'Referer': 'https://www.youtube.com/',
        'Origin': 'https://www.youtube.com',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    })

    if (!response.ok || !response.body) {
      throw new Error(`YouTube CDN respondió con status ${response.status}`)
    }

    const contentType = format?.mimeType?.split(';')[0] ?? 'video/mp4'

    const headers: HeadersInit = {
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${encodeURIComponent(videoTitle)}.mp4"`,
      'Cache-Control': 'no-store',
    }

    if (format?.contentLength) {
      headers['Content-Length'] = format.contentLength
    }

    return new Response(response.body, { headers })
  } catch (error: any) {
    console.error('Error al descargar video:', error?.message ?? error)
    return NextResponse.json(
      { error: 'No se pudo descargar el video. Intenta de nuevo.' },
      { status: 500 }
    )
  }
}
