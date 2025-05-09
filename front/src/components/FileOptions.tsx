import { MoreVertical } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ImageDialog } from './ImageDialog'
import { DeleteDialog } from './DeleteDialog'

export const FileOptions = ({
  fileName,
  documentId,
  imageUrl,
}: {
  fileName: string
  documentId: string
  imageUrl: string
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <span className="inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-100 cursor-pointer">
          <MoreVertical className="w-4   h-4" />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        onClick={(e) => e.stopPropagation()}
        className="w-56"
      >
        <DeleteDialog fileName={fileName} documentId={documentId} />
        <ImageDialog fileName={fileName} imageUrl={imageUrl} />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
