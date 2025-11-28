import toast from "react-hot-toast";

export const exportResultsToCSV = (data) => {
  if (data.length === 0) {
    toast.error("No data to export");
    return;
  }

  const headers = [
    "Examinee",
    "Email",
    "Department",
    "Quiz",
    "Score",
    "Status",
    "Date",
    "Time",
  ];
  
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      [
        `"${row.examinee_name || row.name || ""}"`,
        row.email || "",
        row.department || "",
        row.quiz_name || "",
        row.score || "",
        row.status || "",
        row.date || "",
        row.time || "",
      ].join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `results_${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
  toast.success("Results exported successfully");
};