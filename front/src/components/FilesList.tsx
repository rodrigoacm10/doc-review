'use client'

import { getDocuments } from '@/services/documents'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Accordion } from './ui/accordion'
import { Search, Loader2 } from 'lucide-react'
import { FileAccordionItem } from './FileAccordionItem'

export const FilesList = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['documents'],
    queryFn: getDocuments,
  })

  const [searchTerm, setSearchTerm] = useState('')

  const filteredData = data?.filter((file) =>
    file.originalFilename.toLowerCase().includes(searchTerm.toLowerCase()),
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

      <div className="flex items-center gap-2 mb-6 border px-3 py-2 rounded-lg w-full max-w-md bg-white shadow-sm">
        <Search className="text-gray-500" size={18} />
        <input
          type="text"
          placeholder="Buscar por nome do arquivo"
          className="w-full outline-none text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center gap-2 text-gray-500">
          <Loader2 className="animate-spin" size={20} />
          <p className="text-sm">Carregando documentos...</p>
        </div>
      ) : error ? (
        <p className="text-center text-red-500 font-semibold">
          Erro ao carregar documentos
        </p>
      ) : !filteredData || filteredData.length === 0 ? (
        <p className="text-center opacity-60">Nenhum documento encontrado</p>
      ) : (
        <div className="h-[850px] overflow-y-scroll">
          <Accordion
            type="single"
            collapsible
            className="w-full shadow-[0_0_20px_0_rgba(0,0,0,0.1)] px-3 overflow-hidden"
          >
            {filteredData.map((file) => (
              <FileAccordionItem
                key={file.id}
                documentId={file.id}
                imageUrl={file.imageUrl}
                originalFilename={file.originalFilename}
                extractedText={file.extractedText}
                llmResponse={file.llmResponse}
              />
            ))}
          </Accordion>
        </div>
      )}
    </div>
  )
}
