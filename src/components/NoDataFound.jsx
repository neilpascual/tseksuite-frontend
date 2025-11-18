import React from 'react'

function NoDataFound() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12 text-slate-400 mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v-9A2.25 2.25 0 015.25 5.25h13.5A2.25 2.25 0 0121 7.5v9a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 16.5z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 7.5l9 6 9-6"
                />
              </svg>
              <p className="text-slate-600 font-medium">No Candidates Found</p>
              <p className="text-slate-400 text-sm">Please check back later or add new candidates.</p>
    </div>
  )
}

export default NoDataFound
