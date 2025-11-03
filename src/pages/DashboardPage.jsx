import React from "react";
import Card from "../components/admin/Card";
import FilterButton from "../components/admin/FilterButton";
import ExportButton from "../components/admin/ExportButton";
import Table from "../components/admin/Table";
import { useAuth } from "../hooks/useAuth";


function DashboardPage() {
  const { data: user, isLoading, isError } = useAuth();

  if (isLoading) return <div>Loading user...</div>;
  if (isError || !user) return <div>Failed to load user</div>;

  console.log("User data:", user);
      
  return (
    <>
      <div className="p-5 sm:p-10 md:p-15 lg:p-20 xl:p-25 min-h-screen">

        {/* main div */}
        <p className="text-[#2E99B0] text-xl sm:text-2xl font-medium mb-5">
            Dashboard
        </p>

        {/* cards */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-5 sm:gap-7 md:gap-10 mb-20">
            <Card />
            <Card />
            <Card />
        </div>
        
        {/* applicant table header + buttons */}
        <div className="flex flex-col sm:flex-row flex-wrap sm:justify-between sm:items-center gap-4 mb-5">
            <p className="text-[#2E99B0] text-xl sm:text-2xl font-medium">
                All Applicants
            </p>
             <div className="flex justify-start sm:justify-end gap-3 w-full sm:w-auto">
              <ExportButton />
              <FilterButton />
             </div>
        </div>

        {/* table */}
        <div className="rounded-lg shadow-md p-2 bg-white">
            <Table />
        </div>
      </div>
    </>
  );
}

export default DashboardPage;

