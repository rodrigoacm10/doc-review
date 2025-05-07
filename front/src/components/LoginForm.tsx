'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, LoginData } from '@/schemas/loginSchema'
import { useMutation } from '@tanstack/react-query'
import { loginRequest } from '@/services/auth'
import { useRouter } from 'next/navigation'

export function LoginForm() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  })

  const { mutate, isPending } = useMutation({
    mutationFn: loginRequest,
    onSuccess: (data) => {
      console.log('Login bem-sucedido', data)

      router.push('/documents')
    },
    onError: (error: any) => {
      if (error.response?.data?.message) {
        setError('email', { message: error.response.data.message })
      }
    },
  })

  const onSubmit = (data: LoginData) => {
    mutate(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded"
        disabled={isPending}
      >
        {isPending ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  )
}
