import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface Props {
  params: Promise<{ id: string }>
}

// POST /api/songs/[id]/like — dar/quitar like
export async function POST(req: Request, { params }: Props) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const { id: songId } = await params

  // Verificar que la canción existe
  const song = await prisma.song.findUnique({ where: { id: songId } })
  if (!song) return NextResponse.json({ error: 'Canción no encontrada' }, { status: 404 })

  // Toggle: si ya tiene like lo quita, si no lo pone
  const existing = await prisma.like.findUnique({
    where: { userId_songId: { userId: session.user.id, songId } },
  })

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } })
    const count = await prisma.like.count({ where: { songId } })
    return NextResponse.json({ liked: false, count })
  } else {
    await prisma.like.create({ data: { userId: session.user.id, songId } })
    const count = await prisma.like.count({ where: { songId } })
    return NextResponse.json({ liked: true, count })
  }
}

// GET /api/songs/[id]/like — estado del like del usuario actual
export async function GET(req: Request, { params }: Props) {
  const session = await getServerSession(authOptions)
  const { id: songId } = await params

  const count = await prisma.like.count({ where: { songId } })

  if (!session?.user?.id) {
    return NextResponse.json({ liked: false, count })
  }

  const existing = await prisma.like.findUnique({
    where: { userId_songId: { userId: session.user.id, songId } },
  })

  return NextResponse.json({ liked: !!existing, count })
}
