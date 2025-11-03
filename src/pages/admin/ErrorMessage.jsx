import React from 'react'
import { useNavigate } from "react-router-dom";
import ErrorImage from '../../assets/404.png';

function ErrorMessage() {
   const navigate = useNavigate();
  return (
    <div className='h-screen flex justify-center items-center'>
        <div className='text-center space-y-3 flex items-center flex-col'>
            <img src={ErrorImage} alt="404" className='h-50 ' />
            <h1 className='text-4xl font-bold text-[#2E99B0]'>Oops! Page not found</h1>
            <p> The page you’re looking for doesn’t exist or has been moved.</p>
              <button
        onClick={() => navigate("/admin/dashboard")}
        className="bg-[#2E99B0] text-white px-8 py-3 rounded-md shadow-md hover:bg-[#27879D] transition"
      >
        Go Back
      </button>
        </div>
    </div>
  )
}

export default ErrorMessage