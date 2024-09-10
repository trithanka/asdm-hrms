import React from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Box, Button, Drawer as MuiDrawer } from "@mui/material";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import { styled, useTheme } from "@mui/material/styles";
import { ChevronLeft } from "@mui/icons-material";

interface IDrawer {
  open: boolean;
  handleDrawerClose: () => void;
  children: React.ReactNode;
}

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

export default function Drawer({ open, handleDrawerClose, children }: IDrawer) {
  const theme = useTheme();

  return (
    <MuiDrawer anchor="right" open={open} onClose={handleDrawerClose}>
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === "rtl" ? (
            <ChevronRightIcon />
          ) : (
            <ChevronLeftIcon />
          )}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <Box px={2} pt={1}>
        <Button startIcon={<ChevronLeft />} onClick={handleDrawerClose}>
          Back
        </Button>
      </Box>
      {children}
    </MuiDrawer>
  );
}
