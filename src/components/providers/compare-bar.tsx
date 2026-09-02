'use client'

import { Scale, X, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface CompareBarProps {
  selectedProviders: { id: string; name: string }[]
  onRemove: (id: string) => void
  onClear: () => void
}

export function CompareBar({ selectedProviders, onRemove, onClear }: CompareBarProps) {
  if (selectedProviders.length === 0) return null

  const compareUrl = `/compare?ids=${selectedProviders.map((p) => p.id).join(',')}`

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 backdrop-blur-xl border border-slate-700 text-white rounded-2xl shadow-2xl px-5 py-3.5 flex items-center justify-between gap-6 max-w-xl w-[90%] animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center text-white shrink-0">
          <Scale className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-xs sm:text-sm text-white">Compare ({selectedProviders.length}/3)</h4>
          <div className="flex items-center gap-1.5 mt-0.5">
            {selectedProviders.map((p) => (
              <span key={p.id} className="bg-slate-800 text-slate-200 border border-slate-700 text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1">
                {p.name.split(' ')[0]}
                <button onClick={() => onRemove(p.id)} className="hover:text-red-400">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button onClick={onClear} className="text-xs text-slate-400 hover:text-slate-200 transition-colors hidden sm:block">
          Clear
        </button>
        <Link href={compareUrl}>
          <Button variant="gradient" size="sm" className="rounded-xl text-xs">
            Compare Now <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
