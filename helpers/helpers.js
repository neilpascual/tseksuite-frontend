
  export const transformResult = (result) => ({
  id: result.result_id,
  examiner_name: `${result.Examiner?.first_name || ""} ${result.Examiner?.last_name || ""}`,
  email: result.Examiner?.email || "N/A",
  department: result.Examiner?.Department?.dept_name || "N/A",
  quiz_name: result.Quiz?.quiz_name || "N/A",
  score: result.score ?? 0,
  status: result.status,
  date: new Date(result.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }),
});