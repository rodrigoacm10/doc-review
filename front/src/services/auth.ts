'use server'

import { api } from '@/lib/api'
import { LoginSchemaType } from '@/schemas/loginSchema'
import { RegisterShemaType } from '@/schemas/registerSchema'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

type UserType = { email: string; id: string; name: string; password: string }

export async function loginRequest(data: LoginSchemaType) {
  const response = await api.post('/auth/login', data, {
    withCredentials: true,
  })

  if (response.data.access_token)
    (await cookies()).set('token', response.data.access_token)

  return response.data
}

export async function logout() {
  ;(await cookies()).delete('token')
  redirect('/')
}

export async function registerRequest(
  data: RegisterShemaType,
): Promise<UserType> {
  const response = await api.post('/auth/register', data, {
    withCredentials: true,
  })

  return response.data
}
