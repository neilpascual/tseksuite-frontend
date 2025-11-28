export const groupDataByExaminee = (data) => {
  const map = new Map();

  data.forEach((row) => {
    const email = row.email?.toString().trim() || null;
    const name = row.examiner_name || row.name || "Unknown Examinee";
    const department = row.department || "No Department";

    const attemptId = row.id || `${row.date || "unknown"}|${row.time || "unknown"}`;
    const key = email || name || String(attemptId);

    if (!map.has(key)) {
      map.set(key, {
        key,
        email,
        name,
        department,
        attempts: [],
      });
    }

    map.get(key).attempts.push({
      attemptId,
      date: row.date || new Date(row.created_at || row.createdAt).toLocaleDateString(),
      time: row.time || (row.created_at ? new Date(row.created_at).toLocaleTimeString() : ""),
      score: row.score || 0,
      status: row.status || "Unknown",
      quiz: row.quiz_name || "Unknown Quiz",
      total_points: row.total_points || 0,
      raw: row,
    });
  });

  const groups = Array.from(map.values()).map((g) => {
    g.attempts.sort((a, b) => {
      const aDt = new Date(a.raw?.created_at || a.raw?.createdAt || `${a.date} ${a.time}`);
      const bDt = new Date(b.raw?.created_at || b.raw?.createdAt || `${b.date} ${b.time}`);
      return bDt - aDt;
    });
    return g;
  });

  groups.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  return groups;
};