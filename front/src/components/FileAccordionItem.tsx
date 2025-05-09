import { downloadDoc } from '@/utils/downloadDoc'
import { FileOptions } from './FileOptions'
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion'
import { Button } from './ui/button'
import { toast } from 'sonner'
import { ExpandableText } from './ExpandableText'
import { ChatArea } from './ChatArea'

const TextContent = ({
  title,
  text,
  fileText,
}: {
  title: string
  text: string
  fileText: string
}) => {
  return (
    <>
      <div className="mb-5 mt-8">
        <h3 className="!font-poppins font-semibold text-xl">{title}</h3>
        <p className="opacity-60 text-sm">{text}</p>
      </div>
      <ExpandableText text={fileText} />
    </>
  )
}

const ButtonDownload = ({
  title,
  documentId,
  full,
}: {
  title: string
  documentId: string
  full: boolean
}) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <p>{title}</p>
      <Button
        onClick={async () => {
          try {
            await downloadDoc(documentId, full)
            toast('Documento baixado com sucesso!', {
              style: { color: 'green', fontWeight: 'bold' },
            })
          } catch (err) {
            toast('Erro ao baixar documento', {
              style: { color: 'red', fontWeight: 'bold' },
            })
            console.error(err)
          }
        }}
      >
        Baixar
      </Button>
    </div>
  )
}

export const FileAccordionItem = ({
  documentId,
  imageUrl,
  originalFilename,
  extractedText,
  llmResponse,
}: {
  documentId: string
  imageUrl: string
  originalFilename: string
  extractedText: string
  llmResponse: string
}) => {
  return (
    <AccordionItem key={documentId} value={documentId}>
      <AccordionTrigger className="flex items-center">
        <div className="flex items-center gap-1">
          <FileOptions
            fileName={originalFilename}
            imageUrl={imageUrl}
            documentId={documentId}
          />

          <div className="hidden sm:flex justify-center items-center h-[60px] w-[60px]">
            {/*  eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}${imageUrl}`}
              alt="Preview do documento"
              className="h-full w-full object-contain rounded-lg shadow bg-[#f3f4f1]/70"
            />
          </div>
        </div>
        <p>{originalFilename}</p>
      </AccordionTrigger>
      <AccordionContent className="px-3">
        <div className="py-3">
          <div className="mb-5 flex gap-5">
            <ButtonDownload
              title="Baixar arquivo"
              documentId={documentId}
              full={false}
            />

            <ButtonDownload
              title="Baixar arquivo com textos abaixo"
              documentId={documentId}
              full={true}
            />
          </div>

          <TextContent
            title="Texto extraído da imagem"
            text="Informações que conseguimos retirar da imagem"
            fileText={extractedText}
          />

          <TextContent
            title="Informações interpretadas pela IA"
            text="Informações que conseguimos retirar do texto extraído"
            fileText={llmResponse}
          />

          <div className="mb-5 mt-8">
            <h3 className="!font-poppins font-semibold text-xl">Chat IA</h3>
            <p className="opacity-60 text-sm">
              Tire suas dúvidas em relação ao documento conversando com a IA
            </p>
          </div>
          <ChatArea documentId={documentId} />
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
