import React from 'react'

function Card() {
    const items = [
        { title: 'Test takers', value: 1200 },
    ];
  return (
     <div className="border rounded-2xl py-10 px-20 border-[#EFF0F6] shadow-md sm:py-5 sm:px-10 flex-1 min-w-[200px]">
        {items.map((item, index) => (
            <div key={index} className={`mb-2 ${index === items.length - 1 ? 'mb-0' : ''}`}>
                <p className="text-[#2E99B0] text-lg sm:text-xl font-medium mb-2">
                    {item.title}
                </p>
                <p className="text-xl sm:text-2xl font-bold">
                    {item.value}
                </p>
            </div>
        ))}
     </div>
  )
}

export default Card