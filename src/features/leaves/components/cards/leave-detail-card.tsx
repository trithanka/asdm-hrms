import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

interface ILeaveDetailCard {
  children: React.ReactNode;
  title: string;
}

export default function LeaveDetailCard({ children, title }: ILeaveDetailCard) {
  return (
    <Paper variant="outlined" sx={{ px: 3, py: 2, height: "100%" }}>
      <Typography pb={3} variant="body2" fontWeight={700} color="text.dark">
        {title}
      </Typography>
      {children}
    </Paper>
  );
}
