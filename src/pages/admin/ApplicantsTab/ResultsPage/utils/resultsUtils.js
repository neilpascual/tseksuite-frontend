export const exportToCSV = (data) => {
  const headers = [
    "ID",
    "Name",
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
        row.id,
        `"${row.examiner_name || ""}"`,
        row.email || "",
        row.department || "",
        `"${row.quiz_name || ""}"`,
        row.score || 0,
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
};

/**
 * Get unique values from array of objects for a specific key
 * @param {Array} data - Array of objects
 * @param {string} key - Key to extract unique values from
 * @returns {Array} Array of unique values
 */
export const getUniqueValues = (data, key) => {
  return [...new Set(data.map((item) => item[key]).filter(Boolean))];
};