import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface Props {
  params: Promise<{ id: string }>
}

// PATCH /api/songs/[id] — Editar canción (ADMIN o MODERATOR)
export async function PATCH(req: Request, { params }: Props) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const role = (session.user as any).role
  if (role !== 'ADMIN' && role !== 'MODERATOR') {
    return NextResponse.json({ error: 'Sin permisos suficientes' }, { status: 403 })
  }

  const { id } = await params
  const body = await req.json()

  if (!body.title?.trim()) {
    return NextResponse.json({ error: 'El título es requerido' }, { status: 400 })
  }
  if (!body.rhythmType?.trim()) {
    return NextResponse.json({ error: 'El ritmo es requerido' }, { status: 400 })
  }

  try {
    const song = await prisma.song.update({
      where: { id },
      data: {
        title: body.title.trim(),
        authorName: body.authorName?.trim() || null,
        youtubeUrl: body.youtubeUrl.trim(),
        rhythmType: body.rhythmType.trim(),
        lyrics: body.lyrics?.trim() || null,
      },
    })
    return NextResponse.json(song)
  } catch {
    return NextResponse.json({ error: 'Canción no encontrada' }, { status: 404 })
  }
}

// DELETE /api/songs/[id] — Eliminar canción (solo ADMIN)
export async function DELETE(req: Request, { params }: Props) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const role = (session.user as any).role
  if (role !== 'ADMIN') {
    return NextResponse.json({ error: 'Solo los administradores pueden eliminar canciones' }, { status: 403 })
  }

  const { id } = await params

  try {
    await prisma.song.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Canción no encontrada' }, { status: 404 })
  }
}
