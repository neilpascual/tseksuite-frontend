import React from 'react'

function Card() {
    const items = [
        { title: 'Test takers', value: 1200 },

    ];
  return (
     <div className="border rounded-2xl p-3 border-[#EFF0F6] shadow-md sm:py-2 sm:px-6 md:py-4 md:px-6 lg:py-5 lg:px-10 flex-1 min-w-[200px] font-['Poppins']">
        {items.map((item, index) => (
     <div key={index} className="mb-2 last:mb-0">
                    <p className="text-[#2E99B0] text-sm sm:text-xl font-medium mb-2">
                        {item.title}
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-end">
                        {item.value}
                    </p>
                </div>
        ))}
     </div>
  )
}

export default Card