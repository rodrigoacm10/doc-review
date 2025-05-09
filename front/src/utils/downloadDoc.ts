export const downloadDoc = async (id: string, full: boolean) => {
  const res = await fetch(`/api/download/${id}${full ? '/full' : ''}`)

  if (!res.ok) {
    throw new Error('Erro ao baixar o documento')
  }

  const blob = await res.blob()

  const contentDisposition = res.headers.get('Content-Disposition')
  const match = contentDisposition?.match(/filename="?(.+?)"?$/)
  const filename = match?.[1] || 'arquivo'

  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}
