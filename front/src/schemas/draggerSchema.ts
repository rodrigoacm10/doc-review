import { z } from 'zod'

export const draggerSchema = z.object({
  file: z.instanceof(File, { message: 'Arquivo obrigatório*' }),
})

export type DraggerSchemaType = z.infer<typeof draggerSchema>
