import { useState } from 'react'
import SearchBar from './components/SearchBar'
import TextDisplay from './components/TextDisplay'
import { useSefariaSearch } from './hooks/useSefariaSearch'

interface SearchResult {
  reference: string
  hebrew: string
  translation: string
  category: string
  source: string
  source_url: string
}

function App() {
  const [results, setResults] = useState<SearchResult[]>([])
  const searchMutation = useSefariaSearch()

  const handleSearch = async (query: string) => {
    try {
      const data = await searchMutation.mutateAsync(query)
      setResults(data.results || [])
    } catch (error) {
      console.error('Search failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Torah Study App</h1>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
              FR
            </button>
            <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
              עב
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <SearchBar onSearch={handleSearch} />

        {/* Loading State */}
        {searchMutation.isPending && (
          <div className="mt-8 text-center text-gray-600">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2">Recherche en cours...</p>
          </div>
        )}

        {/* Error State */}
        {searchMutation.isError && (
          <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            Une erreur est survenue lors de la recherche. Veuillez réessayer.
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="mt-8 space-y-6">
            {results.map((result, index) => (
              <TextDisplay
                key={`${result.reference}-${index}`}
                reference={result.reference}
                hebrew={result.hebrew}
                translation={result.translation}
                category={result.category}
                sourceUrl={result.source_url}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!searchMutation.isPending && results.length === 0 && !searchMutation.isError && (
          <div className="mt-16 text-center text-gray-500">
            <p className="text-lg">Posez une question sur la Torah pour commencer</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
