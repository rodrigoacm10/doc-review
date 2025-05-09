import { getDocuments } from '@/services/documents'
import { downloadDoc } from '@/utils/downloadDoc'
import { useQuery } from '@tanstack/react-query'
import { ChatArea } from './ChatArea'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion'
import { Button } from './ui/button'
import { ExpandableText } from './ExpandableText'
import { toast } from 'sonner'
import { FileOptions } from './FileOptions'

export const FilesList = () => {
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
        <Accordion
          type="single"
          collapsible
          className="w-full shadow-[0_0_20px_0_rgba(0,0,0,0.1)] px-3 overflow-hidden"
        >
          {data.map((file) => (
            <AccordionItem key={file.id} value={file.id}>
              <AccordionTrigger className="flex items-center">
                <div className="flex items-center gap-1">
                  <FileOptions
                    fileName={file.originalFilename}
                    imageUrl={file.imageUrl}
                    documentId={file.id}
                  />

                  <div className="hidden sm:flex justify-center items-center h-[60px] w-[60px]">
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}${file.imageUrl}`}
                      alt="Preview do documento"
                      className="h-full w-full object-contain rounded-lg shadow bg-[#f3f4f1]/70"
                    />
                  </div>
                </div>
                <p>{file.originalFilename}</p>
              </AccordionTrigger>
              <AccordionContent className="px-3  ">
                <div className="py-3 ">
                  <div className="mb-5 flex gap-5">
                    <div className="flex flex-col items-center gap-2">
                      <p>Baixar arquivo</p>
                      <Button
                        onClick={async () => {
                          try {
                            await downloadDoc(file.id, false)
                            toast('Documento baixad com sucesso!', {
                              style: { color: 'green', fontWeight: 'bold' },
                            })
                          } catch (err) {
                            toast('Erro ao baixar documento', {
                              style: { color: 'red', fontWeight: 'bold' },
                            })
                          }
                        }}
                      >
                        Baixar
                      </Button>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      <p>Baixar arquivo com textos abaixo</p>
                      <Button
                        onClick={async () => {
                          try {
                            await downloadDoc(file.id, true)
                            toast('Documento baixad com sucesso!', {
                              style: { color: 'green', fontWeight: 'bold' },
                            })
                          } catch (err) {
                            toast('Erro ao baixar documento', {
                              style: { color: 'red', fontWeight: 'bold' },
                            })
                          }
                        }}
                      >
                        Baixar
                      </Button>
                    </div>
                  </div>

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

                  <div className="mb-5 mt-8">
                    <h3 className="!font-poppins font-semibold text-xl">
                      Chat IA
                    </h3>
                    <p className="opacity-60 text-sm">
                      Tire suas dúvidas em relação ao documento conversando a IA
                    </p>
                  </div>
                  <ChatArea documentId={file.id} />
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  )
}
