import { ChevronRight } from "@mui/icons-material";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import { Button, Paper, Stack, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface IProps {
  label: string;
  value: number;
  disableRedirect?: boolean;
  link?: string;
  bgColor?: string;
}

export default function StatisticCard({ label, value, link, bgColor }: IProps) {
  const theme = useTheme();
  const navigate = useNavigate();

  const redirect = () => navigate(link ?? "#");

  return (
    <Paper
      variant="outlined"
      sx={{
        bgcolor: bgColor || theme.palette.primary.light,
        color: "#fff",
        px: 3,
        pt: 2,
        pb: 1,
        height: "100%",
      }}
    >
      <Stack>
        <Stack direction="row" gap={1} alignItems="center">
          <PeopleRoundedIcon fontSize="large" />
          <Typography variant="body2" fontWeight={600}>
            {label}
          </Typography>
        </Stack>
        <Typography variant="h3" fontWeight={700} pt={1}>
          {value}
        </Typography>
      </Stack>
      {link && (
        <Stack direction="row" justifyContent="end">
          <Button
            size="small"
            color="inherit"
            endIcon={<ChevronRight />}
            onClick={redirect}
          >
            More
          </Button>
        </Stack>
      )}
    </Paper>
  );
}
