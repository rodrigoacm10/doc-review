'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  getDocumentsConversation,
  postDocumentsConversation,
} from '@/services/documents'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

const messageSchema = z.object({
  question: z.string().min(1, 'Digite uma pergunta'),
})

type MessageSchema = z.infer<typeof messageSchema>

interface ChatAreaProps {
  documentId: string
}

export function ChatArea({ documentId }: ChatAreaProps) {
  const queryClient = useQueryClient()

  const {
    data: conversations,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['documentConversation', documentId],
    queryFn: () => getDocumentsConversation(documentId),
  })

  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: (data: MessageSchema) =>
      postDocumentsConversation(documentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['documentConversation', documentId],
      })
      reset()
    },
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MessageSchema>({
    resolver: zodResolver(messageSchema),
  })

  const onSubmit = (data: MessageSchema) => {
    sendMessage(data)
  }

  console.log('data ->>', conversations)

  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-6">
      <div className="space-y-4">
        {isLoading && <p>Carregando conversa...</p>}
        {isError && <p>Erro ao carregar a conversa.</p>}

        {conversations?.conversations.map((conv: any) => (
          <div
            key={conv.id}
            className="p-4 border rounded-lg space-y-2 bg-white shadow"
          >
            <p className="font-medium text-gray-800">Você: {conv.question}</p>
            <p className="text-gray-600">Assistente: {conv.answer}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        <textarea
          {...register('question')}
          placeholder="Digite sua pergunta..."
          className="w-full p-2 border rounded resize-none h-24"
        />
        {errors.question && (
          <p className="text-red-500 text-sm">{errors.question.message}</p>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {isPending ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
    </div>
  )
}
