import { useState, useEffect } from "react";
import { getAllExaminers, deleteExamineeAttempt } from "../../../../../../api/api";
import toast from "react-hot-toast";

export const useTestsData = () => {
  const [rawData, setRawData] = useState([]);
  const [filteredRawData, setFilteredRawData] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(false);

  const fetchAllExaminers = async () => {
    try {
      setIsDataLoading(true);
      const res = await getAllExaminers();
      setRawData(Array.isArray(res) ? res : []);
      setFilteredRawData(Array.isArray(res) ? res : []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch examiners");
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    fetchAllExaminers();
  }, []);

  const deleteAttempt = async (attemptId) => {
    try {
      await deleteExamineeAttempt(attemptId);
      
      setRawData((prev) => prev.filter((r) => {
        const candidateId = r.attempt_id || r.attemptId || r.attempt || r.id || `${r.date}|${r.time}`;
        return String(candidateId) !== String(attemptId);
      }));

      setFilteredRawData((prev) => prev.filter((r) => {
        const candidateId = r.attempt_id || r.attemptId || r.attempt || r.id || `${r.date}|${r.time}`;
        return String(candidateId) !== String(attemptId);
      }));

      toast.success("Attempt deleted successfully");
      return true;
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete. Please try again.");
      return false;
    }
  };

  return {
    rawData,
    filteredRawData,
    isDataLoading,
    setFilteredRawData,
    deleteAttempt,
    refetchData: fetchAllExaminers,
  };
};