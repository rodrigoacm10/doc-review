'use client'

import { LoginForm } from '@/components/LoginForm'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#f3f4f1]">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-5 text-center">DocReview</h1>
        <h2 className="text-lg font-bold mb-4 text-center font-poligon">
          Login
        </h2>
        <LoginForm />
        <Button
          onClick={() => {
            router.push('/register')
          }}
          variant="link"
          type="submit"
          className="w-full transition duration-200   py-2 rounded"
        >
          se cadastrar
        </Button>
      </div>
    </div>
  )
}
