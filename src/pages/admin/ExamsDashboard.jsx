import { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import TestsPage from "../admin/ApplicantsTab/TestPage/index";
import ResultsPage from "./ApplicantsTab/ResultsPage/index";

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
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          aria-label="exams tabs" 
          sx={{
              "& .MuiTabs-indicator": {
                backgroundColor: "#3A91AC",
                height: 3,
              },
            }}>
          <Tab label="Examinees" sx={{
            color: '#3A91AC', 
            "&.Mui-selected": {
              color: '#3A91AC', 
              fontWeight: 'bold', 
            },
          }}/>
          <Tab label="Results"sx={{
            color: '#3A91AC', 
            "&.Mui-selected": {
              color: '#3A91AC',
              fontWeight: 'bold', 
            },
          }}/>
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
