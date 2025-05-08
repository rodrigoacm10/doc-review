import { NextRequest, NextResponse } from 'next/server'
import { getDownloadIdDocumentsPdf } from '@/services/documents'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    return await getDownloadIdDocumentsPdf(params.id)
  } catch (error) {
    console.error('Erro ao baixar o documento:', error)
    return new NextResponse('Erro no download', { status: 500 })
  }
}
