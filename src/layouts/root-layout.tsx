import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuIcon from "@mui/icons-material/Menu";
import { LoadingButton } from "@mui/lab";
import { Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import MuiDrawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { grey } from "@mui/material/colors";
import { CSSObject, Theme, styled, useTheme } from "@mui/material/styles";
import * as React from "react";
import { Outlet } from "react-router-dom";
import Profile from "../components/ui/profile";
import NavList from "../features/dashboard/components/navigation/nav-list";
import Notification from "../features/notification/notification";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updatePassword } from "../api/authenticate";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    // width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function RootLayout() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [passwordModalOpen, setPasswordModalOpen] = React.useState(false);
  const [passwordModalType, setPasswordModalType] = React.useState<"forgot" | "reset">("forgot");
  const [oldPassword, setOldPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const handleDrawerClose = () => {
    setOpen(true);
  };

  const toggleDrawerState = () => setOpen((prev) => !prev);

  React.useEffect(() => {
    const shouldForcePasswordChange = localStorage.getItem("forcePasswordChange") === "1";
    setPasswordModalType("forgot");
    setPasswordModalOpen(shouldForcePasswordChange);
  }, []);

  const updatePasswordMutation = useMutation({
    mutationFn: updatePassword,
    onSuccess(data) {
      if (data?.status === false || data?.status === "failed" || data?.status === "error") {
        toast.error(data?.message ?? "Failed to update password");
        return;
      }

      localStorage.removeItem("forcePasswordChange");
      setPasswordModalOpen(false);
      setPasswordModalType("forgot");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success(data?.message ?? "Password updated successfully");
    },
    onError(error: any) {
      toast.error(error?.response?.data?.message || "Failed to update password");
    },
  });

  const handlePasswordSubmit = () => {
    if (passwordModalType === "reset" && !oldPassword) {
      toast.error("Old password is required");
      return;
    }

    if (!newPassword || !confirmPassword) {
      toast.error("All required password fields must be filled");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    updatePasswordMutation.mutate({
      type: passwordModalType,
      oldPassword: passwordModalType === "reset" ? oldPassword : undefined,
      newPassword,
      confirmPassword,
    });
  };

  const handleOpenResetPassword = () => {
    setPasswordModalType("reset");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordModalOpen(true);
  };

  const handleClosePasswordModal = () => {
    if (passwordModalType === "forgot") {
      return;
    }

    setPasswordModalOpen(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <AppBar
          position="fixed"
          open={open}
          color="inherit"
          variant="outlined"
          elevation={0}
          sx={{ zIndex: (theme: Theme) => theme.zIndex.drawer + 2 }}
        >
          <Toolbar>
            <Stack direction="row" justifyContent="space-between" width="100%">
              <Stack direction="row" alignItems="center">
                <IconButton
                  color="primary"
                  aria-label="open drawer"
                  onClick={toggleDrawerState}
                  edge="start"
                  sx={{
                    marginRight: 3,
                  }}
                >
                  <MenuIcon />
                </IconButton>
                <Typography noWrap fontWeight={500}>
                  ASDM HR Dashboard
                </Typography>
              </Stack>

              <Stack direction="row" alignItems="center" gap={2}>
                <Notification />

                <Profile onOpenResetPassword={handleOpenResetPassword} />
              </Stack>
            </Stack>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
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
          <NavList open={open} />
        </Drawer>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            bgcolor: grey[50],
          }}
        >
          <DrawerHeader />
          <Box sx={{ flexGrow: 1, overflow: "auto", p: 3 }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
      <Dialog
        open={passwordModalOpen}
        disableEscapeKeyDown={passwordModalType === "forgot"}
        onClose={handleClosePasswordModal}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          {passwordModalType === "forgot" ? "Change Password" : "Reset Password"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {passwordModalType === "reset" && (
              <TextField
                label="Old Password"
                type="password"
                value={oldPassword}
                onChange={(event) => setOldPassword(event.target.value)}
                fullWidth
              />
            )}
            <TextField
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              fullWidth
            />
            <TextField
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          {passwordModalType === "reset" && (
            <LoadingButton onClick={handleClosePasswordModal} color="inherit">
              Cancel
            </LoadingButton>
          )}
          <LoadingButton
            variant="contained"
            onClick={handlePasswordSubmit}
            loading={updatePasswordMutation.isPending}
            fullWidth={passwordModalType === "forgot"}
          >
            Update Password
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
