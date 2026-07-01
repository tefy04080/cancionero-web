import { prisma } from '@/lib/prisma'
import type { Song, User } from '@prisma/client'

export type SongWithAuthor = Song & {
  author: Pick<User, 'id' | 'name' | 'image'> | null
}

export const songRepository = {
  async getApprovedSongs(): Promise<SongWithAuthor[]> {
    return prisma.song.findMany({
      where: { status: 'APPROVED' },
      include: {
        author: { select: { id: true, name: true, image: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
  },

  async getSongById(id: string): Promise<SongWithAuthor | null> {
    return prisma.song.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, image: true } },
      },
    })
  },

  async getPendingSongs(): Promise<SongWithAuthor[]> {
    return prisma.song.findMany({
      where: { status: 'PENDING' },
      include: {
        author: { select: { id: true, name: true, image: true } },
      },
      orderBy: { createdAt: 'asc' },
    })
  },

  async createSong(data: {
    title: string
    authorName?: string
    lyrics?: string
    youtubeUrl: string
    rhythmType: string
    authorId: string
  }): Promise<Song> {
    return prisma.song.create({
      data: {
        ...data,
        status: 'PENDING',
      },
    })
  },

  async updateStatus(id: string, status: string): Promise<Song> {
    return prisma.song.update({
      where: { id },
      data: { status },
    })
  },
}
