'use client'

import { postDocuments } from '@/services/documents'
import { useState } from 'react'

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<
    'idle' | 'uploading' | 'success' | 'error'
  >('idle')
  const [message, setMessage] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setStatus('uploading')
    const formData = new FormData()
    formData.append('file', file)

    console.log('token', localStorage.getItem('token'))

    try {
      const res = await postDocuments(formData)

      if (!res.ok) throw new Error('Erro no upload')

      setStatus('success')
      setMessage('Fatura enviada com sucesso!')
    } catch (err) {
      setStatus('error')
      setMessage('Erro ao enviar fatura.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button type="submit" disabled={status === 'uploading'}>
        {status === 'uploading' ? 'Enviando...' : 'Enviar Fatura'}
      </button>
      {status === 'success' && <p style={{ color: 'green' }}>{message}</p>}
      {status === 'error' && <p style={{ color: 'red' }}>{message}</p>}
    </form>
  )
}
