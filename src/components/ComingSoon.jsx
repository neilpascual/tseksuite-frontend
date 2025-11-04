import React from 'react'
import ComingSoonImg from '../assets/WIP.png';

function ComingSoon() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center text-center font-['Poppins']">
      <img src={ComingSoonImg} alt="404" className='h-50 ' />
        <h1 className='text-4xl font-bold text-[#2E99B0]'>Something awesome is on the way!</h1>
        <p>We’re currently working on this feature to give you the best experience possible. Stay tuned</p>
    </div>
  )
}

export default ComingSoon
