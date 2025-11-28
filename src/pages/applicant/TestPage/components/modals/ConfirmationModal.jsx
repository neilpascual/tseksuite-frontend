import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

const ConfirmationModal = ({ state, onClose }) => (
  <Dialog
    open={state.open}
    onClose={onClose}
    maxWidth="sm"
    fullWidth
    PaperProps={{ sx: { borderRadius: "12px", padding: "8px" } }}
  >
    <DialogTitle sx={{ fontSize: "20px", fontWeight: "bold", color: "#1a1a1a", pb: 1 }}>
      {state.title}
    </DialogTitle>
    <DialogContent>
      <Typography sx={{ fontSize: "16px", color: "#4a5568", lineHeight: 1.6 }}>
        {state.message}
      </Typography>
    </DialogContent>
    <DialogActions sx={{ padding: "16px 24px" }}>
      {state.showCancel && (
        <Button
          onClick={onClose}
          sx={{
            color: "#6b7280",
            textTransform: "none",
            fontSize: "15px",
            fontWeight: 500,
            "&:hover": { backgroundColor: "#f3f4f6" },
          }}
        >
          Cancel
        </Button>
      )}
      <Button
        onClick={state.onConfirm}
        variant="contained"
        sx={{
          bgcolor: state.type === "exit" ? "#dc2626" : "#2E99B0",
          "&:hover": {
            bgcolor: state.type === "exit" ? "#b91c1c" : "#267a8d",
          },
          textTransform: "none",
          fontSize: "15px",
          fontWeight: 600,
          boxShadow: "2px 2px 0px 0px rgba(0, 0, 0, 0.1)",
        }}
      >
        {state.type === "exit" ? "Exit Test" : "OK"}
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmationModal;