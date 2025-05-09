'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDropzone } from 'react-dropzone'
import { postDocuments } from '@/services/documents'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { draggerSchema, DraggerSchemaType } from '@/schemas/draggerSchema'
import { FileContainer } from './FileContainer'

export function DraggerUpload({
  onUploadSuccess,
}: {
  onUploadSuccess: () => void
}) {
  const [status, setStatus] = useState<'idle' | 'uploading' | 'error'>('idle')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const {
    setValue,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<DraggerSchemaType>({
    resolver: zodResolver(draggerSchema),
  })

  const file = watch('file')

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setValue('file', acceptedFiles[0], { shouldValidate: true })
    }
  }

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)

      return () => URL.revokeObjectURL(objectUrl)
    } else {
      setPreviewUrl(null)
    }
  }, [file])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'image/*': [],
    },
  })

  const onSubmit = async (data: DraggerSchemaType) => {
    setStatus('uploading')
    const formData = new FormData()
    formData.append('file', data.file)

    try {
      const res = await postDocuments(formData)
      if (!res) throw new Error('Erro no upload')

      setStatus('idle')
      reset()
      setPreviewUrl(null)
      onUploadSuccess()

      toast('Fatura enviada com sucesso!', {
        style: { color: 'green', fontWeight: 'bold' },
      })
    } catch (err) {
      setStatus('error')

      toast('Erro ao enviar fatura.', {
        style: { color: 'red', fontWeight: 'bold' },
      })
      console.error(err)
    }
  }

  return (
    <div className="w-full font-poligon">
      <div className="mb-10">
        <h2 className="!font-poppins font-bold text-xl text-center">
          Faça Análise de uma Imagem
        </h2>
        <p className="opacity-60 text-center">
          selecione um arquivo JPEG ou PNG
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-3 max-w-md mx-auto"
      >
        <div className="bg-white p-3 rounded-xl w-full h-[200px] -[0_0_40px_0_rgba(0,0,0,0.1)]">
          <div
            {...getRootProps()}
            className={cn(
              'flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer text-center transition w-full h-full',
              isDragActive ? 'border-primary bg-accent/50' : 'border-[#d8c48e]',
            )}
          >
            <input {...getInputProps()} />
            <p>Arraste e solte um arquivo aqui ou clique para selecionar</p>
            {errors.file && (
              <p className="text-sm text-red-500">{errors.file.message}</p>
            )}
          </div>
        </div>

        <p className="font-[700]">Arquivo selecionado</p>

        {previewUrl ? (
          <FileContainer
            previewUrl={previewUrl}
            fileName={file.name}
            status={status}
            clickFunc={() => {
              reset()
              setPreviewUrl(null)
              setStatus('idle')
            }}
          />
        ) : (
          <p className="text-center text-sm opacity-60">
            nenhum arquivo selecionado
          </p>
        )}

        <Button
          type="submit"
          disabled={status === 'uploading'}
          className="w-full"
        >
          {status === 'uploading' ? 'Enviando...' : 'Enviar Fatura'}
        </Button>
      </form>
    </div>
  )
}
