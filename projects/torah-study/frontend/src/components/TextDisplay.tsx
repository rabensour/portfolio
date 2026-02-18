import CommentaryPanel from './CommentaryPanel'

interface Commentary {
  commentator: string
  hebrew?: string
  translation?: string
  reference: string
}

interface TextDisplayProps {
  reference: string
  hebrew: string
  translation?: string
  category: string
  sourceUrl: string
  commentaries?: Commentary[]
}

export default function TextDisplay({
  reference,
  hebrew,
  translation,
  category,
  sourceUrl,
  commentaries,
}: TextDisplayProps) {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{reference}</h3>
            <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
              {category}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded border border-gray-200">
              Source: Sefaria
            </span>
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              🔗 Vérifier
            </a>
          </div>
        </div>
      </div>

      {/* Text Content */}
      <div className="grid md:grid-cols-2 gap-6 p-6">
        {/* Hebrew Text */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
            Hébreu
          </h4>
          <div
            className="hebrew-text text-xl leading-relaxed p-4 bg-gray-50 rounded-lg border border-gray-200"
            dir="rtl"
          >
            {hebrew}
          </div>
        </div>

        {/* Translation */}
        {translation && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
              Traduction
            </h4>
            <div className="text-lg leading-relaxed p-4 bg-gray-50 rounded-lg border border-gray-200">
              {translation}
            </div>
          </div>
        )}
      </div>

      {/* Commentaries */}
      {commentaries && commentaries.length > 0 && (
        <div className="border-t border-gray-200">
          <CommentaryPanel commentaries={commentaries} />
        </div>
      )}
    </div>
  )
}
