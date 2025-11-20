import { Search } from 'lucide-react';
import React from 'react';

function SearchAndFilter({ filterActive, searchTerm, onChangeSearchValue, onFilterClicked }) {
  // Define filters dynamically
  const filters = [
    { key: 'all', label: 'All', color: 'bg-cyan-600' },
    { key: 'active', label: 'Active', color: 'bg-green-700' },
    { key: 'inactive', label: 'Inactive', color: 'bg-red-500' },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-3 bg-white p-3 xl:p-1">
      {/* Search input */}
      <div className="flex-1 relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={onChangeSearchValue}
          className="w-full pl-10 pr-4 py-3 text-sm lg:text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
        />
      </div>

      {/* Filter buttons */}
      <div className="flex gap-2">
        {filters.map((filter) => {
          const isActive = filterActive === filter.key;
          const baseClasses =
            'px-3 lg:px-4 py-2 text-sm lg:text-base rounded-2xl font-medium transition-all';
          const activeClasses = `shadow-md text-white ${filter.color}`;
          const inactiveClasses = 'bg-gray-100 text-gray-600 hover:bg-gray-200';

          return (
            <button
              key={filter.key}
              onClick={() => onFilterClicked(filter.key)}
              className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default SearchAndFilter;
