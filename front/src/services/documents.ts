'use server'

import { api } from '@/lib/api'
import { LoginData } from '@/schemas/loginSchema'
import { fileTypeFromBuffer } from 'file-type'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function getDocuments() {
  const token = (await cookies()).get('token')

  if (!token?.value) {
    throw new Error('Token não encontrado')
  }

  const response = await api.get('/documents/my', {
    headers: {
      Authorization: `Bearer ${token?.value}`,
    },
    withCredentials: true,
  })

  return response.data
}

export const getDownloadIdDocuments = async (id: string) => {
  const token = (await cookies()).get('token')?.value

  if (!token) {
    return new NextResponse('Token não encontrado', { status: 401 })
  }

  const response = await api.get(`/documents/download/${id}`, {
    responseType: 'arraybuffer',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const buffer = Buffer.from(response.data)
  const fileType = await fileTypeFromBuffer(buffer)

  const mime = fileType?.mime || 'application/octet-stream'
  const ext = fileType?.ext || 'bin'
  const filename = `documento.${ext}`

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': mime,
      'Content-Disposition': `attachment; filename=${filename}`,
    },
  })
}

export async function postDocuments(data: any) {
  const token = (await cookies()).get('token')

  if (!token?.value) {
    throw new Error('Token não encontrado')
  }

  console.log('enviado ->', data)
  const response = await api.post('/documents/upload', data, {
    headers: {
      Authorization: `Bearer ${token?.value}`,
    },
    withCredentials: true,
  })

  console.log('REsponse ->', response)

  return response.data
}

export async function getDocumentsConversation(documentId: string) {
  const token = (await cookies()).get('token')

  if (!token?.value) {
    throw new Error('Token não encontrado')
  }

  const response = await api.get(`/documents/${documentId}/conversations`, {
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
  const response = await api.post(`/documents/${documentId}/ask`, data, {
    headers: {
      Authorization: `Bearer ${token?.value}`,
    },
    withCredentials: true,
  })

  console.log('REsponse ->', response)

  return response.data
}
