'use client'

import { Mail, Github, Linkedin } from 'lucide-react'

export const Footer = () => {
  return (
    <div className="flex flex-col gap-5 items-center justify-center px-8 py-4 bg-[#333131]">
      <div className="w-full text-white max-w-3xl flex justify-between px-8">
        <div>
          <p className="font-poppins font-bold text-white mb-5">DocReview</p>
          <p className="text-sm">Desenvolvedor</p>
          <p className="font-bold">Rodrigo Andrade</p>
        </div>

        <ul className="flex flex-col gap-3 text-xs">
          <li className="flex items-center gap-2">
            <Linkedin size={18} />
            <a
              href="https://www.linkedin.com/in/rodrigo-andrade-5420b2277/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </li>
          <li className="flex items-center gap-2">
            <Github size={18} />
            <a
              href="https://github.com/rodrigoacm10"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </li>
          <li className="flex items-center gap-2">
            <Mail size={18} />
            <a href="mailto:rodrigoacm10@gmail.com">Email</a>
          </li>
        </ul>
      </div>
    </div>
  )
}
