import AddLocationAltRoundedIcon from "@mui/icons-material/AddLocationAltRounded";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import * as React from "react";
import AddLocation from "./components/add-location";
import LocationsList from "./components/locations-list";
import BackButton from "../../components/backbutton";

export default function LocationPage() {
  const [openAddLocation, setOpenAddLocation] = React.useState(false);

  const openAddLocationDialog = () => setOpenAddLocation(true);
  const closeAddLocationDialog = () => setOpenAddLocation(false);

  return (
    <>
      <Paper variant="outlined">
        <Stack py={2} px={3}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h5" fontWeight={500}>
              Locations List
            </Typography>

            <Box display={"flex"} alignItems={"center"} gap={2}>
              <Button
                startIcon={<AddLocationAltRoundedIcon />}
                variant="outlined"
                size="small"
                onClick={openAddLocationDialog}
              >
                Add Location
              </Button>
              <BackButton />
            </Box>
          </Stack>

          <LocationsList />
        </Stack>
      </Paper>

      <AddLocation
        open={openAddLocation}
        closeHandler={closeAddLocationDialog}
      />
    </>
  );
}
