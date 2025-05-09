'use client'

import { DraggerUpload } from '@/components/DraggerUpload'
import { FilesList } from '@/components/FilesList'
import { useQueryClient } from '@tanstack/react-query'

export default function DocumentsPage() {
  const queryClient = useQueryClient()

  const handleUploadSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['documents'] })
  }

  return (
    <div>
      <div className="bg-[#f3f4f1] flex items-center justify-center py-20">
        <div className="max-w-3xl w-full px-8">
          <DraggerUpload onUploadSuccess={handleUploadSuccess} />
        </div>
      </div>
      <div className="max-w-3xl mx-auto mt-10 px-8 py-10">
        <FilesList />
      </div>
    </div>
  )
}
