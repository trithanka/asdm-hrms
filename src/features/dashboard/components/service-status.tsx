import { Card, CardContent, Paper, Stack, Typography } from "@mui/material";
import { lightGreen, yellow } from "@mui/material/colors";
import { Link } from "react-router-dom";

interface Props {
  activeCount: string | undefined;
  regignationCount: string | undefined;
}

export default function ServiceStatus({
  activeCount,
  regignationCount,
}: Props) {
  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Typography variant="subtitle2">Service Status</Typography>

      <Stack direction="row" gap={2} pt={2}>
        <Card variant="outlined" sx={{ flex: 1 }}>
          <Link
            to={"/leave-activity/?staff=active"}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <CardContent sx={{ bgcolor: lightGreen[100] }}>
              <Typography align="center" fontWeight={500} gutterBottom>
                Active
              </Typography>
              <Typography variant="h4" align="center">
                {activeCount || 0}
              </Typography>
            </CardContent>
          </Link>
        </Card>
        <Card variant="outlined" sx={{ flex: 1 }}>
          <Link
            to={"/leave-activity/?staff=resigned"}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <CardContent sx={{ bgcolor: yellow[100] }}>
              <Typography align="center" fontWeight={500} gutterBottom>
                Release
              </Typography>
              <Typography variant="h4" align="center">
                {regignationCount || 0}
              </Typography>
            </CardContent>
          </Link>
        </Card>{" "}
      </Stack>
    </Paper>
  );
}
