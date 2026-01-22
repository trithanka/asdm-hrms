import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  useTheme,
} from "@mui/material";
import * as React from "react";
import { NavLink } from "react-router-dom";

interface INavItem {
  open?: boolean;
  label: string;
  icon: React.ReactNode;
  link: string;
}

export default function NavItem({ open = true, label, icon, link }: INavItem) {
  const theme = useTheme();

  return (
    <ListItem disablePadding sx={{ display: "block" }}>
      <ListItemButton
        component={NavLink}
        to={link}
        sx={{
          minHeight: 40, // Reduced from 48
          justifyContent: open ? "initial" : "center",
          px: 2.5,
          color: theme.palette.text.secondary,
          transition: theme.transitions.create(["background-color", "color"], {
            duration: theme.transitions.duration.shortest,
          }),
          "&:hover": {
            color: theme.palette.primary.main,
            backgroundColor: theme.palette.action.hover,
            "& .MuiListItemIcon-root": {
              color: theme.palette.primary.main,
            },
          },
          "&.active": {
            backgroundColor: theme.palette.primary.light + "20", // Light primary background
            color: theme.palette.primary.main,
            "& .MuiListItemIcon-root": {
              color: theme.palette.primary.main,
            },
            "& .MuiTypography-root": {
              fontWeight: 600,
            },
          },
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: open ? 1.5 : 0, // Removed margin-right in collapsed state for centering
            justifyContent: "center",
            color: "inherit",
            "& .MuiSvgIcon-root": {
              fontSize: "1.25rem",
            },
          }}
        >
          {open ? (
            icon
          ) : (
            <Tooltip title={label} placement="right-start">
              <span>{icon}</span>
            </Tooltip>
          )}
        </ListItemIcon>
        <ListItemText
          primary={label}
          sx={{
            display: open ? "block" : "none", // Hide text in collapsed state to allow centering
            opacity: open ? 1 : 0,
            textDecoration: "none",
            "& .MuiTypography-root": {
              fontSize: "0.8125rem",
              fontWeight: 400,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            },
          }}
        />
      </ListItemButton>
    </ListItem>
  );
}
