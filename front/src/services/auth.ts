'use server'

import { api } from '@/lib/api'
import { LoginData } from '@/schemas/loginSchema'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function loginRequest(data: LoginData) {
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
