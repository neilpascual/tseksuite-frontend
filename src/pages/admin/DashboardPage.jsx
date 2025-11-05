
import Card from "../../components/admin/Card";
import { useAuth } from "../../hooks/useAuth";
import { useMediaQuery } from "@mui/material";
import MobileScrollableCards from "../../components/admin/MobileScrollableCards"
import CandidateTable from "../../components/admin/ExaminersTable";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import axios from "axios";

function DashboardPage() {
  const { data: user, isLoading, isError } = useAuth();

  if (isLoading) return <div>Loading user...</div>;
  if (isError || !user) return <div>Failed to load user</div>;

  const isMobile = useMediaQuery("(max-width:600px)");
  const [data, setData] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(false)

  const transformExaminer = (examiner) => ({
    id: examiner.examiner_id,
    examiner_name: `${examiner.first_name} ${examiner.last_name}`,
    department: examiner.Department?.dept_name || "N/A",
    email: examiner.email,
    date: new Date(examiner.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  });

  const fetchAllExaminers = async () => {
    try {
      setIsDataLoading(true);

      const res = await axios.get("http://localhost:3000/api/examiner/get");
      const rawData = res.data.data;

      const formatted = rawData.map(transformExaminer);

      console.log("Raw Data", rawData);
      console.log("Formatted Data", formatted);

      setData(formatted);

    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch examiners");
    } finally {
      setIsDataLoading(false);
    }
  };


    useEffect(() => {
      fetchAllExaminers()
    }, [])


  const headerCells = [
                  { id: "id", label: "ID" },
                  { id: "examiner_name", label: "Name" },
                  { id: "email", label: "Email" },
                  { id: "department", label: "Department" },
                  { id: "date", label: "Date" },
                ]

  const columns = [
    { id: "id", label: "ID" },
    { id: "examiner_name", label: "Applicant Name", bold: true },
    { id: "email", label: "Email"},
    { id: "department", label: "Department" },
    { id: "date", label: "Date" },
  ];

  return (
    <>
      <div className="h-screen lg:mx-10 my-5 px-3 sm:px-6 md:px-8 py-6">
        {/* Header */}
        <h1 className="text-[#2E99B0] text-md sm:text-md md:text-xl lg:text-2xl xl:text-3xl mb-6 font-['Poppins']">
          Dashboard
        </h1>

        {/* Cards */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-4 lg:gap-15 mb-8">
          <Card />
          <Card />
          <Card />
        </div>

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
              <p className="text-slate-600 font-medium">No Candidates Found</p>
              <p className="text-slate-400 text-sm">Please check back later or add new candidates.</p>
            </div>
        ) : 
          (
            <div className="rounded-lg md:shadow-md bg-white overflow-x-auto mt-20">
              {isMobile ? (
                <MobileScrollableCards candidates={data}/>
              ) : (
                <div className="min-w-[350px] sm:min-w-0">
                  <CandidateTable candidates={data} headerCells={headerCells} columns={columns} tableName={'Examiners'}/>
                </div>
              )}
          </div>
          )
        }
      </div>
    </>
  );
}

export default DashboardPage;