import { z } from 'zod'

export const messageSchema = z.object({
  question: z.string().trim().min(1, 'Digite uma pergunta'),
})

export type MessageSchemaType = z.infer<typeof messageSchema>
