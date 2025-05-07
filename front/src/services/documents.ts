'use server'

import { api } from '@/lib/api'
import { LoginData } from '@/schemas/loginSchema'
import { cookies } from 'next/headers'

export async function getDocuments() {
  const token = (await cookies()).get('token')

  if (!token?.value) {
    throw new Error('Token não encontrado')
  }

  const response = await api.get('/documents/my', {
    headers: {
      Authorization: `Bearer ${token?.value}`,
    },
    withCredentials: true, // se estiver usando cookies/sessão
  })

  return response.data
}

export async function postDocuments(data: any) {
  const token = (await cookies()).get('token')

  if (!token?.value) {
    throw new Error('Token não encontrado')
  }

  console.log('enviado ->', data)
  const response = await api.post('/documents/upload', data, {
    headers: {
      Authorization: `Bearer ${token?.value}`, // JWT salvo localmente
    },
    withCredentials: true, // se estiver usando cookies/sessão
  })

  console.log('REsponse ->', response)

  return response.data
}
