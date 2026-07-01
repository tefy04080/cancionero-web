import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { commentSchema } from '@/lib/validators/song.schema'

interface Props {
  params: Promise<{ id: string }>
}

// GET /api/songs/[id]/comments — listar comentarios
export async function GET(req: Request, { params }: Props) {
  const { id: songId } = await params

  const comments = await prisma.comment.findMany({
    where: { songId },
    include: {
      author: { select: { id: true, name: true, image: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return NextResponse.json(comments)
}

// POST /api/songs/[id]/comments — agregar comentario
export async function POST(req: Request, { params }: Props) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Debes iniciar sesión para comentar' }, { status: 401 })
  }

  const { id: songId } = await params

  const song = await prisma.song.findUnique({ where: { id: songId } })
  if (!song) return NextResponse.json({ error: 'Canción no encontrada' }, { status: 404 })

  const body = await req.json()
  const validation = commentSchema.safeParse(body)
  if (!validation.success) {
    return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 })
  }

  const comment = await prisma.comment.create({
    data: {
      content: validation.data.content,
      authorId: session.user.id,
      songId,
    },
    include: {
      author: { select: { id: true, name: true, image: true } },
    },
  })

  return NextResponse.json(comment, { status: 201 })
}
