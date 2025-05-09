import { Loader2, X } from 'lucide-react'

export const FileContainer = ({
  previewUrl,
  fileName,
  status,
  clickFunc,
}: {
  previewUrl: string
  fileName: string
  status: 'idle' | 'uploading' | 'error'
  clickFunc: () => void
}) => {
  return (
    <div className="bg-white rounded-xl grid grid-cols-[60px_1fr] p-2 relative gap-2 shadow-[0_0_20px_0_rgba(0,0,0,0.1)]">
      <div className="flex justify-center items-center h-[60px] w-[60px]">
        {/*  eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={previewUrl}
          alt="Preview do documento"
          className="h-full w-full object-contain rounded-lg shadow bg-[#f3f4f1]/70"
        />
      </div>
      <div className="flex items-center overflow-hidden">
        <p className="truncate font-[600]">{fileName}</p>
      </div>

      <div className="absolute top-2 right-4">
        {status === 'uploading' ? (
          <Loader2 className="animate-spin text-muted-foreground" size={20} />
        ) : (
          <button
            className="hover:cursor-pointer"
            type="button"
            onClick={() => clickFunc()}
            aria-label="Remover arquivo"
          >
            <X
              className="text-red-500 hover:text-red-700 transition"
              size={20}
            />
          </button>
        )}
      </div>
    </div>
  )
}
