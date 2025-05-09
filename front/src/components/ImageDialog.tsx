import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './ui/dialog'

export const ImageDialog = ({
  fileName,
  imageUrl,
}: {
  fileName: string
  imageUrl: string
}) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogTrigger asChild>
        <div
          onClick={(e) => {
            e.stopPropagation()
            setIsOpen(true)
          }}
          className="cursor-pointer h-[40px] rounded-lg border flex items-center justify-center p-2 hover:bg-gray-100"
        >
          <p>ver imagem</p>
        </div>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogTitle>{fileName}</DialogTitle>
        <div className="h-full w-full">
          {/*  eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}${imageUrl}`}
            alt="Preview do documento"
            className="h-full w-full object-contain rounded-lg shadow bg-[#f3f4f1]/70"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
