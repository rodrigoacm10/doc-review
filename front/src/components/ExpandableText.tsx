import { useEffect, useRef, useState } from 'react'

export const ExpandableText = ({ text }: { text: string }) => {
  const paragraphs = text.split('\n').filter((p) => p.trim() !== '')
  const [expanded, setExpanded] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<string>('')

  useEffect(() => {
    if (contentRef.current) {
      if (expanded) {
        setHeight(`${contentRef.current.scrollHeight}px`)
      } else {
        const children = Array.from(contentRef.current.children).slice(0, 5)
        const totalHeight = children.reduce(
          (sum, el) => sum + (el as HTMLElement).offsetHeight,
          0,
        )
        setHeight(`${totalHeight}px`)
      }
    }
  }, [expanded, paragraphs])

  return (
    <div>
      <div
        ref={contentRef}
        style={{
          maxHeight: height,
          overflow: 'hidden',
          transition: 'max-height 0.4s ease',
        }}
        className="flex flex-col gap-3"
      >
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {paragraphs.length > 5 && (
        <button
          className="cursor-pointer mt-2 text-blue-500 text-sm underline"
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? 'Ler menos' : 'Ler mais'}
        </button>
      )}
    </div>
  )
}
