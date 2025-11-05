import ExportButton from '../../../components/admin/ExportButton'
import FilterButton from '../../../components/admin/FilterButton'
import Table from "../../../components/admin/Table";

function ResultsPage() {
  return (
        <div className='h-screen w-full px-3 sm:px-6 md:px-8 py-6'>
          <div className='mb-20'>
            {/* Header */}
             <h1 className="text-[#2E99B0] text-md sm:text-md md:text-xl lg:text-2xl  xl:text-3xl font-['Poppins']">
            Results
            </h1>
            <p>
              This table is for test results
            </p>
          </div>
          <div className='flex gap-4 mb-4'>
            {/* searchbar */}
            <input type="text" name="search" id="search" placeholder='Search' className='border border-[#D1D1D1] hover:border-[#2E99B0] p-3 rounded-lg w-full bg-white '/>
            {/* buttons */}
            <FilterButton />
            <ExportButton />
          </div>
          {/* Table */}
            <div className="rounded-lg shadow-md bg-white overflow-x-auto">
              <div className="min-w-[350px] sm:min-w-0">
                  {/* mock table */}
                  <Table />
              </div>
            </div>
        </div>
  )
}

export default ResultsPage