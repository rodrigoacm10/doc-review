'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  getDocumentsConversation,
  postDocumentsConversation,
} from '@/services/conversations'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRef } from 'react'
import { messageSchema, MessageSchemaType } from '@/schemas/messageSchema'
import { Loader2 } from 'lucide-react'

export function ChatArea({ documentId }: { documentId: string }) {
  const queryClient = useQueryClient()
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const {
    data: conversations,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['documentConversation', documentId],
    queryFn: () => getDocumentsConversation(documentId),
  })

  console.log('concversation', conversations)

  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: (data: MessageSchemaType) =>
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
  } = useForm<MessageSchemaType>({
    resolver: zodResolver(messageSchema),
  })

  const onSubmit = (data: MessageSchemaType) => {
    sendMessage(data)
  }

  const handleAutoResize = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-6">
      <div className="max-h-[400px] overflow-y-auto space-y-4 pr-2">
        {isLoading && <p>Carregando conversa...</p>}
        {isError && <p>Erro ao carregar a conversa.</p>}

        {conversations?.conversations.map((conv) => (
          <div key={conv.id} className="flex flex-col gap-2">
            <div className="flex flex-col items-end">
              <p className="font-bold">Você:</p>
              <p className="bg-[#d8c48e] text-black max-w-[90%] rounded-lg p-3">
                {conv.question}
              </p>
            </div>
            <div className="flex flex-col items-start">
              <p className="font-bold">IA:</p>
              <p className="bg-[#ececec] text-black max-w-[90%] rounded-lg p-3">
                {conv.answer}
              </p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex items-end gap-2">
        <div className="flex-1 bg-gray-100 rounded-lg px-4 py-2">
          <textarea
            placeholder="Digite sua pergunta..."
            className="w-full p-2 bg-transparent outline-none resize-none max-h-48 overflow-y-auto leading-tight"
            {...register('question')}
            name="question"
            ref={(e) => {
              register('question').ref(e)
              textareaRef.current = e
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(onSubmit)()
              }
            }}
            onInput={handleAutoResize}
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-10 h-10 bg-[#d8c48e] text-white rounded-full flex items-center justify-center hover:bg-[#bdab7c] transition"
        >
          {isPending ? (
            <Loader2 className="animate-spin text-muted-foreground" size={16} />
          ) : (
            '➤'
          )}
        </button>
      </form>

      {errors.question && (
        <p className="text-red-500 text-sm">{errors.question.message}</p>
      )}
    </div>
  )
}
