import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { api } from '@/lib/api'
import { fileTypeFromBuffer } from 'file-type'
import { getDownloadIdDocuments } from '@/services/documents'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    return await getDownloadIdDocuments(params.id)
  } catch (error) {
    console.error('Erro ao baixar o documento:', error)
    return new NextResponse('Erro no download', { status: 500 })
  }
}
