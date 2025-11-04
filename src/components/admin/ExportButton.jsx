import React from 'react'
import ExportIcon from '../../assets/Export.png';

function ExportButton() {
  return (
     <button className='flex border py-2 px-10 rounded-md hover:shadow-2xl hover:border-[#2E99B0] hover:text-[#2E99B0] transition-shadow duration-200 items-center bg-white'>
           <img src={ExportIcon} alt="Export" />
           <span className='ml-2'>Export</span>
         </button>
  )
}

export default ExportButton