import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { songRepository } from '@/lib/repositories/song.repository'
import { moderateSongSchema } from '@/lib/validators/song.schema'
import { SongStatus } from '@prisma/client'

// GET /api/songs/pending — Listar canciones PENDING (solo mods/admins)
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    const { role } = session.user
    if (role !== 'MODERATOR' && role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acceso prohibido' }, { status: 403 })
    }

    const songs = await songRepository.getPendingSongs()
    return NextResponse.json(songs)
  } catch (error) {
    console.error('Error fetching pending songs:', error)
    return NextResponse.json({ error: 'Error al obtener canciones pendientes' }, { status: 500 })
  }
}

// PATCH /api/songs/pending — Aprobar o rechazar una canción
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    const { role } = session.user
    if (role !== 'MODERATOR' && role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acceso prohibido' }, { status: 403 })
    }

    const body = await request.json()
    const validation = moderateSongSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ error: 'Estado inválido' }, { status: 400 })
    }

    const { id, status } = body
    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 })
    }

    const updated = await songRepository.updateStatus(id, status as SongStatus)
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error moderating song:', error)
    return NextResponse.json({ error: 'Error al moderar la canción' }, { status: 500 })
  }
}
