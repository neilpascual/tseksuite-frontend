import { Search } from 'lucide-react'
import React from 'react'

function SearchAndFilter({
    filterActive,
    searchTerm,
    onChangeSearchValue,
    onFilterClicked,

}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 bg-white p-3 xl:p-1 ">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={ onChangeSearchValue }
                className="w-full pl-10 pr-4 py-3 text-sm lg:text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={ () => onFilterClicked('all') }
                className={`px-3 lg:px-4 py-2 text-sm lg:text-base rounded-2xl font-medium transition-all ${
                  filterActive === "all"
                    ? "bg-cyan-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              <button
                onClick={() => onFilterClicked('active') }
                className={`px-3 lg:px-4 py-2 text-sm lg:text-base rounded-2xl font-medium transition-all ${
                  filterActive === "active"
                    ? "bg-green-700 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Active
              </button>
              <button
                onClick={ () => onFilterClicked('inactive') }
                className={`px-3 lg:px-4 py-2 text-sm lg:text-base rounded-2xl font-medium transition-all ${
                  filterActive === "inactive"
                    ? "bg-red-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Inactive
              </button>
            </div>
          </div>
  )
}

export default SearchAndFilter
