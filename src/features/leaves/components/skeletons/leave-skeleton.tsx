import { Grid, Skeleton } from "@mui/material";

export default function LeaveSkeleton() {
  return (
    <Grid container component="section" spacing={2}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
        <Grid item xs={12} height="72px" key={item}>
          <Skeleton variant="rounded" height="100%" />
        </Grid>
      ))}
    </Grid>
  );
}
