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
      <NavLink to={link} style={{ textDecoration: "none" }}>
        {({ isActive }) => (
          <ListItemButton
            component={NavLink}
            selected={isActive}
            to={link}
            sx={{
              minHeight: 48,
              justifyContent: open ? "initial" : "center",
              px: 2.5,
              color: theme.palette.text.primary,
            }}
          >
            {open ? (
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                {icon}
              </ListItemIcon>
            ) : (
              <Tooltip title={label} placement="right-start">
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {icon}
                </ListItemIcon>
              </Tooltip>
            )}
            <ListItemText
              primary={label}
              sx={{ opacity: open ? 1 : 0, textDecoration: "none" }}
              primaryTypographyProps={{
                fontWeight: 500,
                fontSize: theme.typography.subtitle2.fontSize,
              }}
            />
          </ListItemButton>
        )}
      </NavLink>
    </ListItem>
  );
}
