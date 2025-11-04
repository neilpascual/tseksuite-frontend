import React from 'react'
import FilterIcon from '../../assets/Filter.png';

function FilterButton() {
  return (
    <button className='flex border py-2 px-10 rounded-md hover:shadow-2xl hover:border-[#2E99B0] hover:text-[#2E99B0] transition-shadow duration-200 items-center bg-white'>
      <img src={FilterIcon} alt="Filter" className=''/>
      <span className='ml-2'>Filter</span>
    </button>
  )
}

export default FilterButton