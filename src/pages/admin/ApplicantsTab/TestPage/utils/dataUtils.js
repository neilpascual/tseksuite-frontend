export const groupDataByExaminee = (filteredRawData) => {
  const map = new Map();

  filteredRawData.forEach((row) => {
    const email = row.email?.toString().trim() || null;
    const name = row.examiner_name || row.name || "Unknown Examiner";
    const department = row.department || "No Department";

    const attemptId =
      row.attempt_id ||
      row.attemptId ||
      row.attempt ||
      row.id ||
      `${row.date || "unknown"}|${row.time || "unknown"}`;

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

export const paginateData = (data, currentPage, rowsPerPage) => {
  const totalItems = data.length;
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentItems = data.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));

  return {
    currentItems,
    totalItems,
    totalPages,
    indexOfFirstRow,
    indexOfLastRow,
  };
};