export const downloadPdf = async (id: string) => {
  const res = await fetch(`/api/download/${id}/full`)
  if (!res.ok) throw new Error('Erro ao baixar documento com conteúdo')

  const blob = await res.blob()
  const url = window.URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', 'documento-completo.pdf')
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}
