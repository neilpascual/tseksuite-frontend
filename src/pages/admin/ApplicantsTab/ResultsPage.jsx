import { useEffect, useState } from 'react';
import ExportButton from '../../../components/admin/ExportButton';
import FilterButton from '../../../components/admin/FilterButton';
import toast from 'react-hot-toast';
import { getAllResults } from '../../../../api/api';
import { Search, ChevronDown, ChevronUp, ChevronsUpDown, ChevronLeft, ChevronRight, FileText } from 'lucide-react';

function ResultsPage() {
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch all test results
  const fetchAllTests = async () => {
    try {
      setIsLoading(true);
      const res = await getAllResults();
      setData(res);
      setAllData(res);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch results");
    } finally {
      setIsLoading(false);
    }
  };

  // Search handler
  const handleSearch = (query) => {
    setCurrentPage(1);
    if (!query) {
      setData(allData);
      return;
    }

    const filtered = allData.filter((item) =>
      Object.values(item).some((value) =>
        value &&
        value.toString().toLowerCase().includes(query.toLowerCase())
      )
    );

    setData(filtered);
  };

  // Sorting function
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sorted = [...data].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setData(sorted);
  };

  useEffect(() => {
    fetchAllTests();
  }, []);

  // Pagination
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const getStatusBadge = (status) => {
    const variants = {
      Passed: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20',
      Failed: 'bg-rose-50 text-rose-700 ring-1 ring-rose-600/20',
      Pending: 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20',
    };
    return variants[status] || 'bg-gray-50 text-gray-700 ring-1 ring-gray-600/20';
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ChevronsUpDown className="ml-1.5 h-3.5 w-3.5 text-gray-400" />;
    }
    return sortConfig.direction === 'asc' ? (
      <ChevronUp className="ml-1.5 h-3.5 w-3.5 text-[#217486]" />
    ) : (
      <ChevronDown className="ml-1.5 h-3.5 w-3.5 text-[#217486]" />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-gradient-to-br from-[#217486] to-[#1a5d6b] rounded-xl shadow-lg shadow-[#217486]/20">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Test Results
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Comprehensive overview of all examination results
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          
          {/* Toolbar */}
          <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              
              {/* Search Bar */}
              <div className="relative w-full lg:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search results..."
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full h-11 pl-11 pr-4 bg-white border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#217486] focus:border-transparent transition-all shadow-sm"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 w-full lg:w-auto">
                <FilterButton />
                <ExportButton />
              </div>
            </div>
          </div>

          {/* Table Content */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="relative">
                <div className="h-12 w-12 rounded-full border-4 border-gray-200"></div>
                <div className="h-12 w-12 rounded-full border-4 border-[#217486] border-t-transparent animate-spin absolute top-0 left-0"></div>
              </div>
              <p className="mt-4 text-sm text-gray-500">Loading results...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="relative mb-4">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#217486]/10 to-[#217486]/5 flex items-center justify-center">
                  <Search className="h-7 w-7 text-[#217486]" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No results found</h3>
              <p className="text-sm text-gray-500 text-center max-w-sm">
                We couldn't find any matching results. Try adjusting your search criteria.
              </p>
            </div>
          ) : (
            <>
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <th 
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-50 transition-colors group"
                        onClick={() => handleSort('id')}
                      >
                        <div className="flex items-center">
                          ID
                          {getSortIcon('id')}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-50 transition-colors group"
                        onClick={() => handleSort('examiner_name')}
                      >
                        <div className="flex items-center">
                          Name
                          {getSortIcon('examiner_name')}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-50 transition-colors group"
                        onClick={() => handleSort('email')}
                      >
                        <div className="flex items-center">
                          Email
                          {getSortIcon('email')}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-50 transition-colors group"
                        onClick={() => handleSort('department')}
                      >
                        <div className="flex items-center">
                          Department
                          {getSortIcon('department')}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-50 transition-colors group"
                        onClick={() => handleSort('quiz_name')}
                      >
                        <div className="flex items-center">
                          Quiz
                          {getSortIcon('quiz_name')}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-50 transition-colors group"
                        onClick={() => handleSort('score')}
                      >
                        <div className="flex items-center">
                          Score
                          {getSortIcon('score')}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-50 transition-colors group"
                        onClick={() => handleSort('status')}
                      >
                        <div className="flex items-center">
                          Status
                          {getSortIcon('status')}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-50 transition-colors group"
                        onClick={() => handleSort('date')}
                      >
                        <div className="flex items-center">
                          Date
                          {getSortIcon('date')}
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentData.map((row, index) => (
                      <tr 
                        key={row.id} 
                        className="hover:bg-gradient-to-r hover:from-[#217486]/5 hover:to-transparent transition-all duration-200 group"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-500">
                            #{row.id}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#217486] to-[#1a5d6b] flex items-center justify-center text-white text-xs font-semibold shadow-sm">
                              {row.examiner_name?.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-semibold text-gray-900">
                              {row.examiner_name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {row.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900 font-medium">
                            {row.department}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {row.quiz_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden max-w-[80px]">
                              <div 
                                className="h-full bg-gradient-to-r from-[#217486] to-[#2a96ad] rounded-full transition-all duration-300"
                                style={{ width: `${row.score}%` }}
                              />
                            </div>
                            <span className="text-sm font-bold text-gray-900 min-w-[45px]">
                              {row.score}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${getStatusBadge(row.status)}`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(row.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-t border-gray-100">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  
                  {/* Rows per page */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 font-medium">Rows per page:</span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="h-9 px-3 pr-8 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#217486] focus:border-transparent appearance-none cursor-pointer shadow-sm"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                        backgroundPosition: 'right 0.5rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.25rem 1.25rem'
                      }}
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>

                  {/* Page info and navigation */}
                  <div className="flex items-center gap-6">
                    <span className="text-sm text-gray-600 font-medium">
                      <span className="text-gray-900">{startIndex + 1}-{Math.min(endIndex, data.length)}</span> of <span className="text-gray-900">{data.length}</span>
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="h-9 w-9 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-[#217486] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200 transition-all shadow-sm"
                      >
                        <ChevronLeft className="h-4 w-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="h-9 w-9 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-[#217486] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200 transition-all shadow-sm"
                      >
                        <ChevronRight className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                  
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResultsPage;