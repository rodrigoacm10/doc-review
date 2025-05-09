import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(2, 'Nome é obrigatório'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha precisa ter no mínimo 6 caracteres'),
})

export type RegisterShemaType = z.infer<typeof registerSchema>
