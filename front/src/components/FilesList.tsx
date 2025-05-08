import { deleteDocuments, getDocuments } from '@/services/documents'
import { downloadDoc } from '@/utils/downloadDoc'
import { downloadPdf } from '@/utils/downloadPdf'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ChatArea } from './ChatArea'

export const FilesList = () => {
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['documents'],
    queryFn: getDocuments,
  })

  if (isLoading) return <p className="text-center">Carregando documentos...</p>
  if (error)
    return (
      <p className="text-center text-red-500">Erro ao carregar documentos</p>
    )

  return (
    <div className="w-full font-poligon">
      <div className="mb-10">
        <h2 className="!font-poppins font-bold text-3xl">
          Lista de Documentos
        </h2>
        <p className="text-lg opacity-60">
          selecione um documento para ver mais informações
        </p>
      </div>

      {data.length === 0 ? (
        <p>Nenhum documento encontrado.</p>
      ) : (
        <ul className="space-y-2">
          {data.map((doc: any) => (
            <li key={doc.id} className="p-4 bg-white rounded shadow">
              <h1 className="font-poligon font-bold text-black text-4xl">
                {doc.originalFilename}
              </h1>
              <img src={`http://localhost:3000${doc.imageUrl}`} />

              <div className="flex gap-10">
                <button
                  onClick={async () => {
                    try {
                      await downloadDoc(doc.id)
                    } catch (err) {
                      console.error('Erro no download:', err)
                    }
                  }}
                >
                  baixar
                </button>

                <button
                  onClick={async () => {
                    try {
                      await downloadPdf(doc.id)
                    } catch (err) {
                      console.error('Erro no download:', err)
                    }
                  }}
                >
                  baixar com conteúdo
                </button>

                <button
                  onClick={async () => {
                    try {
                      await deleteDocuments(doc.id)
                      await queryClient.invalidateQueries({
                        queryKey: ['documents'],
                      })
                    } catch (err) {
                      console.error('Erro ao deletar:', err)
                    }
                  }}
                >
                  deletar
                </button>
              </div>

              <h2 className="font-poligon font-semibold">
                {doc.extractedText}
              </h2>
              <p className="font-poligon text-gray-600">{doc.llmResponse}</p>
              <ChatArea documentId={doc.id} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
