import { z } from 'zod'

const YOUTUBE_REGEX = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|shorts\/)|youtu\.be\/)[\w-]{11}(&.*)?$/

export const contributeSongSchema = z.object({
  title: z
    .string()
    .min(2, 'El título debe tener al menos 2 caracteres')
    .max(100, 'El título no puede superar los 100 caracteres'),

  youtubeUrl: z
    .string()
    .regex(YOUTUBE_REGEX, 'Ingresa un enlace de YouTube válido (ej: https://www.youtube.com/watch?v=...)'),

  rhythmType: z
    .string()
    .min(1, 'Selecciona un tipo de ritmo'),

  lyrics: z
    .string()
    .min(20, 'La letra debe tener al menos 20 caracteres')
    .max(5000, 'La letra no puede superar los 5000 caracteres'),
})

export type ContributeSongInput = z.infer<typeof contributeSongSchema>

export const moderateSongSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
})

export type ModerateSongInput = z.infer<typeof moderateSongSchema>
