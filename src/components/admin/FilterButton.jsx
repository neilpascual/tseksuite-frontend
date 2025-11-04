import React from 'react'
import FilterIcon from '../../assets/Filter.png';

function FilterButton() {
  return (
    <button className='flex border py-2 px-6 rounded-md hover:shadow-2xl hover:border-[#2E99B0] hover:text-[#2E99B0] transition-shadow duration-200 items-center bg-white font-["Poppins"]'>
      <img src={FilterIcon} alt="Filter"  className='w- h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 object-contain'/>
      <span className='ml-2 hidden sm:inline'>Filter</span>
    </button>
  )
}

export default FilterButton