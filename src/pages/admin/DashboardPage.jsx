import DashboardCard from "../../components/admin/Card";
import { useAuth } from "../../hooks/useAuth";
import { useMediaQuery, CircularProgress } from "@mui/material";
import MobileScrollableCards from "../../components/admin/MobileScrollableCards";
import CandidateTable from "../../components/admin/ExaminersTable";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { getAllExaminers, getAllResults } from "../../../api/api";
import NoDataFound from "../../components/NoDataFound";
import LoadingIndicator from "../../components/LoadingIndicator";

function DashboardPage() {
  const { data: user, isLoading, isError } = useAuth();

  const isMobile = useMediaQuery("(max-width:600px)");
  const [examiners, setExaminers] = useState([]);
  const [results, setResults] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(false);

  const fetchAllExaminers = async () => {
    try {
      setIsDataLoading(true);
      const res = await getAllExaminers();
      setExaminers(res);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch examiners");
    } finally {
      setIsDataLoading(false);
    }
  };

  const fetchAllResults = async () => {
    try {
      setIsDataLoading(true);
      const res = await getAllResults();
      setResults(res);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch results");
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    fetchAllExaminers();
    fetchAllResults();
  }, []);

  const headerCells = [
    { id: "id", label: "ID" },
    { id: "examiner_name", label: "Name" },
    { id: "email", label: "Email" },
    { id: "department", label: "Department" },
    { id: "date", label: "Date" },
  ];

  const columns = [
    { id: "id", label: "ID" },
    { id: "examiner_name", label: "Applicant Name", bold: true },
    { id: "email", label: "Email" },
    { id: "department", label: "Department" },
    { id: "date", label: "Date" },
  ];

  if (isLoading) return <div>Loading user...</div>;
  if (isError || !user) return <div>Failed to load user</div>;

  return (
    <div className="h-screen w-full px-3 sm:px-6 md:px-1 py-6 sm:mt-0 ">
      {/* Header */}
      <h1 className="text-[#2E99B0] text-md sm:text-md md:text-xl lg:text-2xl xl:text-3xl mb-6 mt-20">
        Dashboard
      </h1>

      {/* Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-4 lg:gap-15 sm:mb-8">
        <DashboardCard title="Examinees" value={examiners.length} />
        <DashboardCard
          title="Completed"
          value={results.filter((r) => r.status === "COMPLETED").length}
        />
        <DashboardCard
          title="Abandoned"
          value={results.filter((r) => r.status === "ABANDONED").length}
        />
      </div>

      {isDataLoading && <LoadingIndicator />}

      {examiners.length === 0 ? (
        <NoDataFound />
      ) : (
        <div className="rounded-lg md:shadow-md bg-white overflow-x-auto sm:mt-20 mt-10">
          {isMobile ? (
            <MobileScrollableCards candidates={examiners} />
          ) : (
            <CandidateTable
              candidates={examiners}
              headerCells={headerCells}
              columns={columns}
              tableName={"Examiners"}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
