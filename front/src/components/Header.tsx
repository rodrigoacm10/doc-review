'use client'

import { logout } from '@/services/auth'

export const Header = () => {
  return (
    <div className="flex items-center justify-center px-8 py-4 sticky top-0 bg-[#f3f4f1]/80 z-50">
      <div className="max-w-3xl w-full flex justify-between items-center">
        <p className="font-poppins font-bold">DocReview</p>
        <button
          className="cursor-pointer hover:underline"
          onClick={async () => await logout()}
        >
          sair
        </button>
      </div>
    </div>
  )
}
