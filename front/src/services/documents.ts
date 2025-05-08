'use server'

import { api } from '@/lib/api'
import { LoginData } from '@/schemas/loginSchema'
import { fileTypeFromBuffer } from 'file-type'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// createdAt: '2025-05-08T17:10:01.398Z'
// extractedText: 'Cliente acessa o site e seleciona produtos Cliente revisa o carrinho e confirma o pedido Verifica disponibilidade no estoque\nCanis pirapagoments Notificar indisponibilidade ac\nFEET cliente\nCliente realiza pagamento\nSetor de logistica recebe o\npedido\ntens sdo separados e\nenviados para entrega\nCliente & notificado por e-\nmail do envio\n°\n'
// id: 'ff8f76f3-e026-433b-bf91-6b204d655e56'
// imagePath: 'uploads/ccc922c8-a36b-4d30-9fa6-3650da5b3986.png'
// imageUrl: '/uploads/ccc922c8-a36b-4d30-9fa6-3650da5b3986.png'
// llmResponse: 'Este documento descreve o fluxo de um processo de compra online, desde a seleção de produtos pelo cliente até a entrega do pedido.\n\n1. O cliente acessa o site de vendas e seleciona os produtos que deseja comprar.\n2. O cliente revisa o carrinho de compras (verificando se as informações sobre os produtos e os preços estão corretos) e então confirma o pedido.\n3. O sistema verifica a disponibilidade dos produtos solicitados no estoque.\n4. Caso algum produto não esteja disponível, o cliente é notificado.\n5. O cliente realiza o pagamento do pedido. \n6. O pedido é recebido pelo setor de logística.\n7. Os itens são separados e preparados para o envio ao cliente.\n8. O cliente é notificado por e-mail quando o pedido é despachado para entrega. \n\nAparentemente, há alguns conteúdos que podem ser erros de digitação ou palavras truncadas no documento, como "Canis pirapagoments" e "FEET cliente", que dificultam a compreensão completa do processo descrito.'
// originalFilename: 'diagrama-eng-requisitos.png'
// userId: '11fa654d-92a1-4636-8356-53af86e10494'

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

export const getDownloadIdDocumentsPdf = async (id: string) => {
  const token = (await cookies()).get('token')?.value

  if (!token) {
    return new NextResponse('Token não encontrado', { status: 401 })
  }

  const response = await api.get(`/documents/download/${id}/full`, {
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

  const response = await api.post('/documents/upload', data, {
    headers: {
      Authorization: `Bearer ${token?.value}`,
    },
    withCredentials: true,
  })

  return response.data
}
