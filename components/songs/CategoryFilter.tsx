'use client'

import { useRouter } from 'next/navigation'

interface Props {
  rhythms: string[]
  activeRhythm: string
  activeQuery: string
}

export default function CategoryFilter({ rhythms, activeRhythm, activeQuery }: Props) {
  const router = useRouter()

  const handleClick = (rhythm: string) => {
    const params = new URLSearchParams()
    if (activeQuery) params.set('q', activeQuery)

    if (rhythm === 'Todos') {
      params.delete('rhythm')
    } else {
      params.set('rhythm', rhythm)
    }

    router.push(`/?${params.toString()}`)
  }

  const isActive = (rhythm: string) =>
    rhythm === 'Todos' ? !activeRhythm : activeRhythm === rhythm

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {['Todos', ...rhythms].map(rhythm => (
        <button
          key={rhythm}
          onClick={() => handleClick(rhythm)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 glass-card ${
            isActive(rhythm)
              ? 'text-beni-gold border-beni-gold/50 shadow-md scale-105'
              : 'text-beni-cream/70 hover:text-beni-gold glass-card-hover'
          }`}
          style={
            isActive(rhythm)
              ? { border: '1px solid rgba(244,161,29,0.5)', background: 'rgba(244,161,29,0.1)' }
              : {}
          }
        >
          {rhythm === 'Todos' ? '🎵 Todos' : rhythm}
        </button>
      ))}
    </div>
  )
}
