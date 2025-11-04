import React from 'react'
import ExportIcon from '../../assets/Export.png';

function ExportButton() {
  return (
     <button className='flex border py-2 px-6 rounded-md hover:shadow-2xl hover:border-[#2E99B0] hover:text-[#2E99B0] transition-shadow duration-200 items-center bg-white'>
           <img src={ExportIcon} alt="Export" className='w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 object-contain'/>
           <span className='ml-2 hidden sm:inline'>Export</span>
         </button>
  )
}

export default ExportButton