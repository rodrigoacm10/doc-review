'use client'

import { useQuery } from '@tanstack/react-query'
import { getDocuments } from '@/services/documents'
import { downloadDoc } from '@/utils/downloadDoc'

export default function DocumentsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['documents'],
    queryFn: getDocuments,
  })

  if (isLoading) return <p className="text-center">Carregando documentos...</p>
  if (error)
    return (
      <p className="text-center text-red-500">Erro ao carregar documentos</p>
    )

  console.log('Data ->', data)

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Documentos</h1>
      {data.length === 0 ? (
        <p>Nenhum documento encontrado.</p>
      ) : (
        <ul className="space-y-2">
          {data.map((doc: any) => (
            <li key={doc.id} className="p-4 bg-white rounded shadow">
              <h1 className="font-bold text-black text-4xl">
                {doc.originalFilename}
              </h1>
              <img src={`http://localhost:3000${doc.imageUrl}`} />

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

              <h2 className="font-semibold">{doc.extractedText}</h2>
              <p className="text-gray-600">{doc.llmResponse}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

