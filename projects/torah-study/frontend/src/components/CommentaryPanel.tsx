import { useState } from 'react'

interface Commentary {
  commentator: string
  hebrew?: string
  translation?: string
  reference: string
}

interface CommentaryPanelProps {
  commentaries: Commentary[]
}

export default function CommentaryPanel({ commentaries }: CommentaryPanelProps) {
  const [expanded, setExpanded] = useState(false)

  if (!commentaries || commentaries.length === 0) {
    return null
  }

  return (
    <div className="p-6 bg-amber-50/30">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-lg font-semibold text-gray-900 hover:text-gray-700 transition-colors"
      >
        <span className="text-2xl">{expanded ? '📖' : '💬'}</span>
        <span>Commentaires ({commentaries.length})</span>
        <span className="text-sm text-gray-500">
          {expanded ? '▼' : '▶'}
        </span>
      </button>

      {expanded && (
        <div className="mt-4 space-y-4">
          {commentaries.map((commentary, index) => (
            <div
              key={`${commentary.reference}-${index}`}
              className="bg-white rounded-lg p-4 border border-amber-200"
            >
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-bold text-gray-900">{commentary.commentator}</h5>
                <span className="text-xs text-gray-500">{commentary.reference}</span>
              </div>

              <div className="space-y-3">
                {commentary.hebrew && (
                  <div>
                    <p className="text-xs font-semibold text-gray-600 mb-1">Hébreu</p>
                    <div
                      className="hebrew-text text-sm leading-relaxed p-2 bg-gray-50 rounded"
                      dir="rtl"
                    >
                      {commentary.hebrew}
                    </div>
                  </div>
                )}

                {commentary.translation && (
                  <div>
                    <p className="text-xs font-semibold text-gray-600 mb-1">Traduction</p>
                    <div className="text-sm leading-relaxed p-2 bg-gray-50 rounded">
                      {commentary.translation}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
