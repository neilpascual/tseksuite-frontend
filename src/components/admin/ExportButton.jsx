import React from 'react'
import ExportIcon from '../../assets/Export.png';

function ExportButton() {
  return (
     <button className='flex border py-2 px-10 rounded-md'>
           <img src={ExportIcon} alt="Export" />
           <span className='ml-2'>Export</span>
         </button>
  )
}

export default ExportButton