import { NextRequest, NextResponse } from 'next/server'
import { getDownloadIdDocuments } from '@/services/documents'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    return await getDownloadIdDocuments(params.id, false)
  } catch (error) {
    console.error('Erro ao baixar o documento:', error)
    return new NextResponse('Erro no download', { status: 500 })
  }
}
