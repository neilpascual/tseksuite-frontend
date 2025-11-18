import React from 'react'
import ComingSoonImg from '../assets/WIP.png';

function ComingSoon() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center text-center p-4">
      <img src={ComingSoonImg} alt="Soon" className='h-30 md:h-40 lg:h-50 xl:h-55' />
        <h1 className='text-md md:text-2xl lg:text-3xl xl:text-4xl font-bold text-[#2E99B0]'>Something awesome is on the way!</h1>
        <p className='text-[10px] md:text-[15px] lg:text-md xl:text-lg'>We’re currently working on this feature to give you the best experience possible. Stay tuned.</p>
    </div>
  )
}

export default ComingSoon
