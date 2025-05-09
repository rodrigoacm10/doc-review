'use server'

import { api } from '@/lib/api'
import { fileTypeFromBuffer } from 'file-type'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

type fileType = {
  createdAt: string
  extractedText: string
  id: string
  imagePath: string
  imageUrl: string
  llmResponse: string
  originalFilename: string
  userId: string
}

export async function getDocuments(): Promise<fileType[]> {
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

export async function deleteDocuments(id: string) {
  const token = (await cookies()).get('token')

  if (!token?.value) {
    throw new Error('Token não encontrado')
  }

  const response = await api.delete(`/documents/${id}`, {
    headers: {
      Authorization: `Bearer ${token?.value}`,
    },
    withCredentials: true,
  })

  return response.data
}

export const getDownloadIdDocuments = async (id: string, full: boolean) => {
  const token = (await cookies()).get('token')?.value

  if (!token) {
    return new NextResponse('Token não encontrado', { status: 401 })
  }

  const response = await api.get(
    `/documents/download/${id}${full ? '/full' : ''}`,
    {
      responseType: 'arraybuffer',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

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

export async function postDocuments(data: FormData) {
  const token = (await cookies()).get('token')

  if (!token?.value) {
    throw new Error('Token não encontrado')
  }

  const response = await api.post('/documents/upload', data, {
    headers: {
      Authorization: `Bearer ${token?.value}`,
    },
    withCredentials: true,
  })

  return response.data
}
