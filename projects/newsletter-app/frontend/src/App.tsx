import { useState } from 'react'
import { Header } from './components/common/Header'
import { FilterBar } from './components/newsletter/FilterBar'
import { SearchBar } from './components/newsletter/SearchBar'
import { NewsletterGrid } from './components/newsletter/NewsletterGrid'
import { useEmails } from './hooks/useEmails'
import type { EmailFilters } from './types/email'

function App() {
  const [filters, setFilters] = useState<EmailFilters>({})

  const { data, isLoading } = useEmails(filters)

  const handleCategoryChange = (category?: string) => {
    setFilters((prev) => ({ ...prev, category }))
  }

  const handleSearchChange = (search: string) => {
    setFilters((prev) => ({ ...prev, search: search || undefined }))
  }

  const handleActionRequiredChange = (actionRequired: boolean) => {
    setFilters((prev) => ({ ...prev, actionRequired: actionRequired || undefined }))
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar onSearch={handleSearchChange} />
        </div>

        {/* Filter Bar */}
        <div className="mb-8">
          <FilterBar
            selectedCategory={filters.category}
            onCategoryChange={handleCategoryChange}
            actionRequired={!!filters.actionRequired}
            onActionRequiredChange={handleActionRequiredChange}
          />
        </div>

        {/* Results Count */}
        {!isLoading && data && (
          <div className="mb-4 text-sm text-gray-600">
            {data.total} email{data.total !== 1 ? 's' : ''} trouvé{data.total !== 1 ? 's' : ''}
          </div>
        )}

        {/* Email Grid */}
        <NewsletterGrid emails={data?.emails || []} isLoading={isLoading} />
      </main>
    </div>
  )
}

export default App
