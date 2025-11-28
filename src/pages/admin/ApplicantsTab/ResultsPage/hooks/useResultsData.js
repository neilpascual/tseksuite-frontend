import { useState, useEffect, useCallback } from "react";
import { deleteExamineeTestResult, getAllResults } from "../../../../../../api/api";
import toast from "react-hot-toast";

export const useResultsData = () => {
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAllTests = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await getAllResults();
      setData(res);
      setAllData(res);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch results");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteResult = useCallback(async (attemptId) => {
    try {
      await deleteExamineeTestResult(attemptId);
      
      setAllData((prev) =>
        prev.filter((item) => {
          const candidateId = item.id || `${item.date}|${item.time}`;
          return String(candidateId) !== String(attemptId);
        })
      );

      setData((prev) =>
        prev.filter((item) => {
          const candidateId = item.id || `${item.date}|${item.time}`;
          return String(candidateId) !== String(attemptId);
        })
      );

      toast.success("Result deleted successfully");
      return true;
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete. Please try again.");
      return false;
    }
  }, []);

  const deleteAllResults = useCallback(async (email) => {
    try {
      // Remove all results for this email
      setAllData((prev) =>
        prev.filter(
          (item) =>
            (item.email || "").toLowerCase() !== (email || "").toLowerCase()
        )
      );
      setData((prev) =>
        prev.filter(
          (item) =>
            (item.email || "").toLowerCase() !== (email || "").toLowerCase()
        )
      );

      toast.success("All results deleted for the examinee");
      return true;
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete. Please try again.");
      return false;
    }
  }, []);

  useEffect(() => {
    fetchAllTests();
  }, [fetchAllTests]);

  return {
    data,
    allData,
    isLoading,
    setData,
    fetchAllTests,
    deleteResult,
    deleteAllResults,
  };
};