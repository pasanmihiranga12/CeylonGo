import { useState, useEffect } from 'react'
import { ImagePlus } from 'lucide-react'
import { expectedFilename } from '../utils/images'

/**
 * Tries each candidate src in order (e.g. [backendUrl, localConventionPath]).
 * If every candidate fails to load (because you haven't dropped a real photo
 * in /public/images/... yet), it shows a styled placeholder naming the file
 * it expects instead of a broken-image icon — so the layout still looks
 * intentional before real photography is added.
 */
export default function SmartImage({ candidates = [], alt = '', className = '', imgClassName = '' }) {
  const validCandidates = candidates.filter(Boolean)
  const [index, setIndex] = useState(0)

  useEffect(() => setIndex(0), [candidates.join('|')])

  const current = validCandidates[index]

  if (!current) {
    const hint = validCandidates.length
      ? expectedFilename(validCandidates[validCandidates.length - 1])
      : null
    return (
      <div className={`flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-jungle-700/15 to-jungle-950/25 text-jungle-900/50 ${className}`}>
        <ImagePlus size={28} strokeWidth={1.5} />
        {hint && <span className="px-3 text-center text-[11px] font-medium text-jungle-900/40">{hint}</span>}
      </div>
    )
  }

  return (
    <img
      src={current}
      alt={alt}
      onError={() => setIndex((i) => i + 1)}
      className={`${className} ${imgClassName}`}
    />
  )
}
