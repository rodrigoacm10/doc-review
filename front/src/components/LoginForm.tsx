'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, LoginSchemaType } from '@/schemas/loginSchema'
import { useMutation } from '@tanstack/react-query'
import { loginRequest } from '@/services/auth'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'

export function LoginForm() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  })

  const { mutate, isPending } = useMutation({
    mutationFn: loginRequest,
    onSuccess: (data) => {
      router.push('/documents')
    },
    onError: (error: any) => {
      if (error.response?.data?.message) {
        setError('email', { message: error.response.data.message })
      }
    },
  })

  const onSubmit = (data: LoginSchemaType) => {
    mutate(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-poligon">
      <div>
        <label>Email</label>
        <input
          {...register('email')}
          className="border rounded px-3 py-2 w-full"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label>Senha</label>
        <input
          type="password"
          {...register('password')}
          className="border rounded px-3 py-2 w-full"
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full transition duration-200 bg-[#d8c48e] hover:bg-[#bdab7c] text-black py-2 rounded"
        disabled={isPending}
      >
        {isPending ? (
          <Loader2 className="animate-spin text-muted-foreground" size={20} />
        ) : (
          'Entrar'
        )}
      </Button>
    </form>
  )
}
