import toast from "react-hot-toast";

export const exportToCSV = (filteredRawData) => {
  if (filteredRawData.length === 0) {
    toast.error("No data to export");
    return;
  }

  const headers = ["Examiner", "Email", "Department", "Date", "Time", "AttemptId"];
  const csvContent = [
    headers.join(","),
    ...filteredRawData.map((r) =>
      [
        `"${r.examiner_name || r.name || ""}"`,
        r.email || "",
        r.department || "",
        r.date || r.created_at || "",
        r.time || "",
        (r.attempt_id || r.attemptId || r.id || "").toString(),
      ].join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `examiners_${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
  toast.success("Exported CSV successfully");
};