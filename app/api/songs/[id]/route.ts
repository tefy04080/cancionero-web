import { NextResponse } from 'next/server'
import { songRepository } from '@/lib/repositories/song.repository'

// GET /api/songs/[id] — Detalle de una canción (público, solo canciones APPROVED)
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const song = await songRepository.getSongById(id)

    if (!song) {
      return NextResponse.json({ error: 'Canción no encontrada' }, { status: 404 })
    }

    return NextResponse.json(song)
  } catch (error) {
    console.error('Error fetching song:', error)
    return NextResponse.json({ error: 'Error al obtener la canción' }, { status: 500 })
  }
}
