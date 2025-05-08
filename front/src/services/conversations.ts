'use server'

import { api } from '@/lib/api'
import { cookies } from 'next/headers'

export async function getDocumentsConversation(documentId: string) {
  const token = (await cookies()).get('token')

  if (!token?.value) {
    throw new Error('Token não encontrado')
  }

  const response = await api.get(`/conversations/${documentId}`, {
    headers: {
      Authorization: `Bearer ${token?.value}`,
    },
    withCredentials: true,
  })

  return response.data
}
export async function postDocumentsConversation(
  documentId: string,
  data: { question: string },
) {
  const token = (await cookies()).get('token')

  if (!token?.value) {
    throw new Error('Token não encontrado')
  }

  console.log('enviado ->', data)
  const response = await api.post(`/conversations/${documentId}/ask`, data, {
    headers: {
      Authorization: `Bearer ${token?.value}`,
    },
    withCredentials: true,
  })

  console.log('REsponse ->', response)

  return response.data
}
