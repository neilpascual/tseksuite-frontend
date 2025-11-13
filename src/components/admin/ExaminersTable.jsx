import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  TablePagination,
  Box,
  Typography,
} from "@mui/material";

// 🔹 Sorting helper functions
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilized = array.map((el, index) => [el, index]);
  stabilized.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilized.map((el) => el[0]);
}

function CandidateTable({
  candidates = [],
  headerCells = [],
  columns = [],
  tableName = "",
}) {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // 🔹 Handle sort change
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // 🔹 Handle pagination
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // 🔹 Sort + Paginate data
  const sortedRows = stableSort(candidates, getComparator(order, orderBy));
  const paginatedRows = sortedRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (!candidates || candidates.length === 0) {
    return <div className="flex justify-center items-center">No Data!</div>;
  }

  return (
    <div className="min-w-[350px] sm:min-w-0">
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          overflow: "hidden",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
        }}
      >
        {/* Header */}
        <Box sx={{ padding: "20px 24px", borderBottom: "1px solid #e5e7eb" }}>
          <Typography
            variant="h6"
            sx={{
              color: "#2E99B0",
              fontWeight: 600,
              fontSize: "1.125rem",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            {tableName}
          </Typography>
        </Box>

        {/* Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {headerCells.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    sortDirection={orderBy === headCell.id ? order : false}
                    sx={{
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      color: "#64748b",
                      borderBottom: "1px solid #e5e7eb",
                      padding: "20px 16px",
                      backgroundColor: "#f0f0f0",
                    }}
                  >
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : "asc"}
                      onClick={() => handleRequestSort(headCell.id)}
                      sx={{
                        "&.Mui-active": {
                          color: "#2E99B0",
                        },
                        "&.Mui-active .MuiTableSortLabel-icon": {
                          color: "#2E99B0",
                        },
                      }}
                    >
                      {headCell.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedRows.map((row, index) => (
                <TableRow
                  key={row.id}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#f8fafc",
                    },
                    borderBottom:
                      index === paginatedRows.length - 1
                        ? "none"
                        : "1px solid #f1f5f9",
                  }}
                >
                  {columns.map((col) => (
                    <TableCell
                      key={col.id}
                      sx={{
                        padding: "20px 16px",
                        color: col.color || "#475569",
                        fontWeight: col.bold ? 600 : 400,
                      }}
                    >
                      {row[col.id]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={candidates.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: "1px solid #e5e7eb",
            ".MuiTablePagination-displayedRows, .MuiTablePagination-selectLabel":
              {
                fontSize: "0.875rem",
                color: "#64748b",
              },
          }}
        />
      </Paper>
    </div>
  );
}

export default CandidateTable;
