'use server'

import { api } from '@/lib/api'
import { LoginData } from '@/schemas/loginSchema'
import { cookies } from 'next/headers'

export async function loginRequest(data: LoginData) {
  console.log('enviado ->', data)
  const response = await api.post('/auth/login', data, {
    withCredentials: true, // se estiver usando cookies/sessão
  })

  if (response.data.access_token)
    (await cookies()).set('token', response.data.access_token)

  return response.data
}
