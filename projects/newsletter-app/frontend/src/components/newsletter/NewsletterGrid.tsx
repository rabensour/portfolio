import type { Email } from '../../types/email'
import { EmailCard } from './EmailCard'

interface NewsletterGridProps {
  emails: Email[]
  isLoading: boolean
}

export function NewsletterGrid({ emails, isLoading }: NewsletterGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-20 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        ))}
      </div>
    )
  }

  if (emails.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">📬</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun email pour le moment</h3>
        <p className="text-gray-500">
          Les emails reçus apparaîtront ici automatiquement
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
      {emails.map((email) => (
        <EmailCard key={email.id} email={email} />
      ))}
    </div>
  )
}
