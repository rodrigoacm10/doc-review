import { deleteDocuments, getDocuments } from '@/services/documents'
import { downloadDoc } from '@/utils/downloadDoc'
import { downloadPdf } from '@/utils/downloadPdf'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ChatArea } from './ChatArea'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion'
import { Button } from './ui/button'
import { ImageDialog } from './ImageDialog'
import { DeleteDialog } from './DeleteDialog'
import { useRef, useState, useEffect } from 'react'
import { ExpandableText } from './ExpandableText'

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

      {!data ? (
        <p className="text-center opacity-60">Nenhum documento encontrado</p>
      ) : (
        <Accordion type="single" collapsible className="w-full">
          {data.map((file) => (
            <AccordionItem key={file.id} value={file.id}>
              <AccordionTrigger className="flex items-center">
                <div className="flex items-center gap-2">
                  <DeleteDialog
                    fileName={file.originalFilename}
                    documentId={file.id}
                  />
                  <ImageDialog
                    fileName={file.originalFilename}
                    imageUrl={file.imageUrl}
                  />
                  <div className="flex justify-center items-center h-[60px] w-[60px]">
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}${file.imageUrl}`}
                      alt="Preview do documento"
                      className="h-full w-full object-contain rounded-lg shadow bg-[#f3f4f1]/70"
                    />
                  </div>
                </div>
                <p>{file.originalFilename}</p>
              </AccordionTrigger>
              <AccordionContent>
                <div className="py-3">
                  <div className="mb-5">
                    <h3 className="!font-poppins font-semibold text-xl">
                      Texto extraído da imagem
                    </h3>
                    <p className="opacity-60 text-sm">
                      Informações que conseguimos retirar da imagem
                    </p>
                  </div>
                  <ExpandableText text={file.extractedText} />

                  <div className="mb-5 mt-8">
                    <h3 className="!font-poppins font-semibold text-xl">
                      Informações interpretadas pela IA
                    </h3>
                    <p className="opacity-60 text-sm">
                      Informações que conseguimos retirar do texto Extraído
                    </p>
                  </div>
                  <ExpandableText text={file.llmResponse} />

                  <div></div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  )
}
