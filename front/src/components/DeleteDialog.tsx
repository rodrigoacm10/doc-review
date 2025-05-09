import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { Button } from './ui/button'
import { deleteDocuments } from '@/services/documents'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Trash } from 'lucide-react'

export const DeleteDialog = ({
  fileName,
  documentId,
}: {
  fileName: string
  documentId: string
}) => {
  const queryClient = useQueryClient()

  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogTrigger asChild>
        <div
          onClick={(e) => {
            e.stopPropagation()
            setIsOpen(true)
          }}
          className="h-[40px] rounded-lg flex items-center justify-center p-2 border hover:bg-red-100 transition text-red-500 gap-2"
        >
          <p>Excluir</p>
          <Trash className="h-5 w-5  " />
        </div>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle className="text-xl">Excuindo documento</DialogTitle>
          <DialogDescription className="font-poligon text-lg">
            Você tem certeza que deseja excluir o documento:{' '}
            <span className="text-red-500">{fileName}</span>?
          </DialogDescription>
        </DialogHeader>
        <div className="h-full w-full flex items-center justify-center gap-5">
          <Button
            onClick={async () => {
              try {
                await deleteDocuments(documentId)
                await queryClient.invalidateQueries({
                  queryKey: ['documents'],
                })

                toast('Documento excluído com sucesso!', {
                  style: { color: 'green', fontWeight: 'bold' },
                })
              } catch (err) {
                toast('Erro ao excluir documento.', {
                  style: { color: 'red', fontWeight: 'bold' },
                })
              }
            }}
            variant="destructive"
          >
            Excluir
          </Button>
          <Button onClick={() => setIsOpen(false)} variant="outline">
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
