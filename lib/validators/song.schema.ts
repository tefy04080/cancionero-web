import { z } from 'zod'

const YOUTUBE_REGEX = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|shorts\/)|youtu\.be\/)[\w-]{11}(&.*)?$/

export const contributeSongSchema = z.object({
  title: z
    .string()
    .min(2, 'El título debe tener al menos 2 caracteres')
    .max(100, 'El título no puede superar los 100 caracteres'),

  authorName: z
    .string()
    .max(100, 'El nombre del autor no puede superar los 100 caracteres')
    .optional(),

  youtubeUrl: z
    .string()
    .regex(YOUTUBE_REGEX, 'Ingresa un enlace de YouTube válido (ej: https://www.youtube.com/watch?v=...)'),

  rhythmType: z
    .string()
    .min(1, 'Selecciona o escribe un tipo de ritmo'),

  lyrics: z
    .string()
    .max(5000, 'La letra no puede superar los 5000 caracteres')
    .optional(),
})

export type ContributeSongInput = z.infer<typeof contributeSongSchema>

export const moderateSongSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
})

export type ModerateSongInput = z.infer<typeof moderateSongSchema>

export const commentSchema = z.object({
  content: z
    .string()
    .min(1, 'El comentario no puede estar vacío')
    .max(500, 'El comentario no puede superar los 500 caracteres'),
})

export type CommentInput = z.infer<typeof commentSchema>
