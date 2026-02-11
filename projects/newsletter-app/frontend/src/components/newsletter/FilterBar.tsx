import { useCategories } from '../../hooks/useCategories'

interface FilterBarProps {
  selectedCategory?: string
  onCategoryChange: (category?: string) => void
  actionRequired: boolean
  onActionRequiredChange: (value: boolean) => void
}

export function FilterBar({
  selectedCategory,
  onCategoryChange,
  actionRequired,
  onActionRequiredChange,
}: FilterBarProps) {
  const { data: categories, isLoading } = useCategories()

  if (isLoading) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 w-24 bg-gray-200 rounded-full animate-pulse"></div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => onCategoryChange(undefined)}
          className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-colors ${
            !selectedCategory
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Tous
        </button>

        {categories?.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.name)}
            className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-colors flex items-center gap-2 ${
              selectedCategory === category.name
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>{category.icon}</span>
            <span>{category.name}</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                selectedCategory === category.name
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {category.count}
            </span>
          </button>
        ))}
      </div>

      {/* Action Required Toggle */}
      <div className="flex items-center gap-3">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={actionRequired}
            onChange={(e) => onActionRequiredChange(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
        </label>
        <span className="text-sm font-medium text-gray-700">Action requise uniquement</span>
      </div>
    </div>
  )
}
