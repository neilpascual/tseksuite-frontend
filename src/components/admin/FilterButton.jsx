import React from 'react'
import FilterIcon from '../../assets/Filter.png';

function FilterButton() {
  return (
    <button className='flex border py-2 px-10 rounded-md sm:ml-0 ml-auto'>
      <img src={FilterIcon} alt="Filter" />
      <span className='ml-2'>Filter</span>
    </button>
  )
}

export default FilterButton