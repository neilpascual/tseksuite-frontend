import { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import TestsPage from "../admin/ApplicantsTab/TestsPage"; // adjust path if needed
import ResultsPage from "../admin/ApplicantsTab/ResultsPage"; // adjust path if needed

function ExamsDashboard() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <div className="min-h-screen bg-white ">
      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", px: 0, py: 1, mx:
        {
          xs: 5,
          md: 9,
          lg:22
        }
      }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="exams tabs">
          <Tab label="Examinees" />
          <Tab label="Results" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <Box sx={{ px: 4, py: 6 }}>
        {activeTab === 0 && <TestsPage />}
        {activeTab === 1 && <ResultsPage />}
      </Box>
    </div>
  );
}

export default ExamsDashboard;
