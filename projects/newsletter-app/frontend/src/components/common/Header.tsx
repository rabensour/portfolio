export function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">📰</div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Newsletter</h1>
              <p className="text-sm text-gray-500">Your smart email digest</p>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Powered by Claude AI
          </div>
        </div>
      </div>
    </header>
  )
}
