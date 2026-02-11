import type { Email } from '../../types/email'
import { useDeleteEmail } from '../../hooks/useEmails'

interface EmailCardProps {
  email: Email
}

const sentimentColors = {
  positive: 'bg-green-50 border-l-4 border-green-500',
  neutral: 'bg-gray-50 border-l-4 border-gray-300',
  negative: 'bg-red-50 border-l-4 border-red-500',
}

const categoryColors: Record<string, string> = {
  Work: 'bg-blue-100 text-blue-800',
  Personal: 'bg-green-100 text-green-800',
  Newsletter: 'bg-purple-100 text-purple-800',
  Finance: 'bg-emerald-100 text-emerald-800',
  Shopping: 'bg-pink-100 text-pink-800',
  Social: 'bg-orange-100 text-orange-800',
  Travel: 'bg-cyan-100 text-cyan-800',
  Health: 'bg-red-100 text-red-800',
  Other: 'bg-gray-100 text-gray-800',
}

export function EmailCard({ email }: EmailCardProps) {
  const deleteMutation = useDeleteEmail()

  const handleDelete = () => {
    if (confirm('Delete this email?')) {
      deleteMutation.mutate(email.id)
    }
  }

  return (
    <div
      className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 hover:-translate-y-1 ${sentimentColors[email.sentiment]}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <span
          className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${categoryColors[email.category] || categoryColors.Other}`}
        >
          {email.category}
        </span>
        {email.action_required && (
          <span className="bg-orange-500 text-white rounded-full px-3 py-1 text-xs font-bold">
            Action Required
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900 mt-4 line-clamp-2">{email.title}</h3>

      {/* Summary */}
      <p className="text-gray-700 mt-3 line-clamp-4">{email.summary}</p>

      {/* Key Points */}
      {email.key_points.length > 0 && (
        <ul className="mt-4 space-y-2">
          {email.key_points.slice(0, 3).map((point, index) => (
            <li key={index} className="text-sm text-gray-600 flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span className="line-clamp-2">{point}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        {/* Tags */}
        {email.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {email.tags.slice(0, 4).map((tag, index) => (
              <span key={index} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{new Date(email.received_at).toLocaleDateString()}</span>
          <button
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}
