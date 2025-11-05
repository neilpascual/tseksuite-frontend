import Table from "../../../components/admin/Table";
import React, { useEffect, useState } from 'react'
import { Search } from "lucide-react";
import { Filter } from "lucide-react";
import { useMediaQuery } from "@mui/material";



function TestsPage() {

  const isMobile = useMediaQuery("(max-width:600px)");
  const [data,setData] = useState([]);
  const [isDataLoading,setIsDataLoading] = useState(false)

  // table header cells
  const headerCells =[
    { id: "id", label: "ID"},
    { id: "test_name", label: "Test Name"},
    { id: "department", label: "Department" },
    { id: "date", label: "Date"},
  ]

  //table columns
  const columns = [
    { id: "id", label: "ID" },
    { id: "test_name", label: "Test Name" },
    { id: "department",  label: "Department" },
    { id: "date", label: "Date" },
  ];
  
  return (
    <div className='h-screen w-full px-3 sm:px-6 md:px-8 py-6'>
      <div className='mb-20'>
        {/* Header */}
         <h1 className="text-[#2E99B0] text-md sm:text-md md:text-xl lg:text-2xl  xl:text-3xl font-['Poppins']">
        Tests
        </h1>
        <p>
          This table is for test results
        </p>
      </div>
    <div className='flex mb-4 '>
        {/* searchbar */}
        <div className="relative w-full mr-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2E99B0]" />
          <input
            type="text"
            placeholder="Search"
            className="border border-[#D1D1D1] group-hover:border-[#2E99B0] p-3 pl-10 rounded-lg w-full bg-white focus:outline-none"
          />
        </div>
        {/* buttons */}
          <button className="group flex border border-[#D1D1D1] py-2 px-6 rounded-md hover:shadow-2xl hover:border-[#2E99B0] hover:text-[#2E99B0] transition-shadow duration-200 items-center bg-white font-['Poppins']">
            <Filter className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#D1D1D1] group-hover:text-[#2E99B0] transition-colors duration-200" />
            <span className="ml-2 hidden sm:inline text-[#D1D1D1] group-hover:text-[#2E99B0]">
              Date
            </span>
          </button>
    </div>
      {/* Table */}
        {/* <div className="rounded-lg shadow-md bg-white overflow-x-auto">
          <div className="min-w-[350px] sm:min-w-0"> */}
              {/* mock table */}
              {/* <Table /> */}
          {/* </div>
        </div> */}
                {data.length === 0 ? (
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
              <p className="text-slate-600 font-medium">No Tests Found</p>
              <p className="text-slate-400 text-sm">Please check back later.</p>
            </div>
        ) : 
          (
            <div className="rounded-lg md:shadow-md bg-white overflow-x-auto mt-20">
              {isMobile ? (
                <MobileScrollableCards candidates={data}/>
              ) : (
                <div className="min-w-[350px] sm:min-w-0">
                  <CandidateTable candidates={data} headerCells={headerCells} columns={columns} tableName={'Tests'}/>
                </div>
              )}
          </div>
          )
        }
    </div>
  )
}

export default TestsPage
