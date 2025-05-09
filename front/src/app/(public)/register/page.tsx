import { LoginForm } from '@/components/LoginForm'
import { RegisterForm } from '@/components/RegisterForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-5 text-center">DocReview</h1>
        <h2 className="text-lg font-bold mb-4 text-center font-poligon">
          Cadastrar-se
        </h2>
        <RegisterForm />
      </div>
    </div>
  )
}
