import React from 'react'

function Card() {
    const items = [
        { title: 'Test takers', value: 1200 },
    ];
  return (
     <div className="border rounded-2xl py-10 px-20 border-[#EFF0F6] shadow-md sm:py-2 sm:px-6 flex-1 min-w-[200px] font-['Poppins']">
        {items.map((item, index) => (
            <div key={index} className={`mb-2 ${index === items.length - 1 ? 'mb-0' : ''}`}>
                <p className="text-[#2E99B0] text-lg sm:text-xl font-medium mb-2 font-['Poppins']">
                    {item.title}
                </p>
                <p className="text-xl sm:text-2xl font-bold font-['Poppins']">
                    {item.value}
                </p>
            </div>
        ))}
     </div>
  )
}

export default Card