import { NextResponse } from 'next/server'
import { songRepository } from '@/lib/repositories/song.repository'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { contributeSongSchema } from '@/lib/validators/song.schema'

// GET /api/songs — Listar canciones aprobadas (público)
export async function GET() {
  try {
    const songs = await songRepository.getApprovedSongs()
    return NextResponse.json(songs)
  } catch (error) {
    console.error('Error fetching songs:', error)
    return NextResponse.json({ error: 'Error al obtener canciones' }, { status: 500 })
  }
}

// POST /api/songs — Crear nueva canción (requiere sesión)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const validation = contributeSongSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validation.error.flatten() },
        { status: 400 }
      )
    }

    const song = await songRepository.createSong({
      ...validation.data,
      authorId: session.user.id,
    })

    return NextResponse.json(song, { status: 201 })
  } catch (error) {
    console.error('Error creating song:', error)
    return NextResponse.json({ error: 'Error al crear la canción' }, { status: 500 })
  }
}
