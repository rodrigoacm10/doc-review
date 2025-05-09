'use server'

import { api } from '@/lib/api'
import { cookies } from 'next/headers'

type ConversationType = {
  answer: string
  createdAt: string
  documentId: string
  id: string
  question: string
}

export async function getDocumentsConversation(
  documentId: string,
): Promise<{ conversations: ConversationType[] }> {
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

  const response = await api.post(`/conversations/${documentId}/ask`, data, {
    headers: {
      Authorization: `Bearer ${token?.value}`,
    },
    withCredentials: true,
  })

  return response.data
}
