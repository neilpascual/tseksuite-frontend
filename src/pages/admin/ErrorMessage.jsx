import React from 'react'
import { useNavigate } from "react-router-dom";
import ErrorImage from '../../assets/404.png';

function ErrorMessage() {
   const navigate = useNavigate();
  return (
    <div className='w-full h-screen flex flex-col items-center justify-center text-center font-["Poppins"] p-4'>
            <img src={ErrorImage} alt="404" className='h-30 md:h-40 lg:h-50 xl:h-55' />
            <h1 className='ttext-md md:text-2xl lg:text-3xl xl:text-4xl font-bold text-[#2E99B0]'>Oops! Page not found</h1>
            <p className='text-[10px] md:text-[15px] lg:text-md xl:text-lg'> The page you’re looking for doesn’t exist or has been moved.</p>
              {/* <button
        onClick={() => navigate("/admin/dashboard")}
        className="bg-[#2E99B0] text-white px-8 py-3 rounded-md shadow-md hover:bg-[#27879D] transition"
      >
        Go Back
      </button> */}
    </div>
  )
}

export default ErrorMessage