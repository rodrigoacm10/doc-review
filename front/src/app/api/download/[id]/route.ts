import { NextRequest, NextResponse } from 'next/server'
import { getDownloadIdDocuments } from '@/services/documents'

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params
    return await getDownloadIdDocuments(id, false)
  } catch (error) {
    console.error('Erro ao baixar o documento:', error)
    return new NextResponse('Erro no download', { status: 500 })
  }
}
