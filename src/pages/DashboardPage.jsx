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
       <div className="h-screen w-full px-3 sm:px-6 md:px-8 py-6">
      {/* Header */}
      <h1 className="text-[#2E99B0] text-md sm:text-md md:text-xl lg:text-2xl  xl:text-3xl  mb-6 font-['Poppins']">
        Dashboard
      </h1>

      {/* Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-4 lg:gap-15 mb-8">
        <Card />
        <Card />
        <Card />
      </div>

      {/* Applicants Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h2 className="text-[#2E99B0] text-md sm:text-md md:text-xl lg:text-2xl  xl:text-3xl font-['Poppins']">
          All Applicants
        </h2>
        <div className="flex flex-wrap gap-3 w-full sm:w-auto justify-start sm:justify-end md:justify-end">
          <FilterButton />
          <ExportButton />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg shadow-md bg-white overflow-x-auto">
        <div className="min-w-[350px] sm:min-w-0">
          {/* mock table */}
          <Table />
        </div>
      </div>
    </div>
    </>
  );
}

export default DashboardPage;

