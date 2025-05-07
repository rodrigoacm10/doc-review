import { LoginForm } from '@/components/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h1 className="text-xl font-bold mb-4 text-center">Login</h1>
        <LoginForm />
      </div>
    </div>
  )
}
