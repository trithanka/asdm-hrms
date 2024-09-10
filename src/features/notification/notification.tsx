import * as React from "react";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import { Badge, IconButton, Popover, Stack, Typography } from "@mui/material";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";

export default function Notification() {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "notification-popover" : undefined;

  return (
    <>
      <IconButton aria-describedby={id} onClick={handleClick}>
        <Badge variant="dot" color="error">
          <NotificationsRoundedIcon color="primary" />
        </Badge>
      </IconButton>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Stack
          py={4}
          px={2}
          alignItems="center"
          justifyContent="center"
          width={250}
          height={300}
        >
          <NotificationsOffIcon color="action" fontSize="medium" />
          <Typography variant="subtitle2" color="text.secondary" pt={1}>
            No Notifications
          </Typography>
          <Typography variant="caption" color="text.secondary">
            No new notifications found!
          </Typography>
        </Stack>
      </Popover>
    </>
  );
}
