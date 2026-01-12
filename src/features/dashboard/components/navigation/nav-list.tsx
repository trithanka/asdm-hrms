import { useState, useEffect } from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import TodayRoundedIcon from "@mui/icons-material/TodayRounded";
import PlaylistAddCheckCircleOutlinedIcon from "@mui/icons-material/PlaylistAddCheckCircleOutlined";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
import DeviceUnknownIcon from "@mui/icons-material/DeviceUnknown";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import GroupIcon from "@mui/icons-material/Group";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useTheme } from "@mui/material/styles";
import { useLocation } from "react-router-dom";

import NavItem from "./nav-item";
import { Groups, PersonAdd, TableView } from "@mui/icons-material";

interface INavList {
  open: boolean;
}

export default function NavList({ open }: INavList) {
  const theme = useTheme();
  const location = useLocation();
  const [recruitmentOpen, setRecruitmentOpen] = useState(false);
  const [payrollOpen, setPayrollOpen] = useState(false);

  // Auto-expand and highlight parents if child is active
  const isRecruitmentActive = location.pathname.startsWith("/recruitment");
  const isPayrollActive =
    location.pathname.startsWith("/payroll") ||
    location.pathname.startsWith("/salary-transfer");

  useEffect(() => {
    if (isRecruitmentActive) setRecruitmentOpen(true);
    if (isPayrollActive) setPayrollOpen(true);
  }, [isRecruitmentActive, isPayrollActive]);

  const handleRecruitmentClick = () => {
    setRecruitmentOpen(!recruitmentOpen);
  };

  const handlePayrollClick = () => {
    setPayrollOpen(!payrollOpen);
  };

  const getDropdownStyles = (isActive: boolean) => ({
    minHeight: 40,
    justifyContent: open ? "initial" : "center",
    px: 2.5,
    color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
    backgroundColor: isActive ? theme.palette.primary.light + "10" : "transparent",
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
    "& .MuiListItemIcon-root": {
      color: isActive ? theme.palette.primary.main : "inherit",
    },
    "& .MuiTypography-root": {
      fontWeight: isActive ? 600 : 400,
      fontSize: "0.8125rem",
    },
  });

  return (
    <List>
      <NavItem
        link="/"
        open={open}
        label="Dashboard"
        icon={<DashboardRoundedIcon />}
      />

      <NavItem
        link="/employees"
        open={open}
        label="Employee List"
        icon={<PeopleRoundedIcon />}
      />

      {/* 🔽 Payroll Dropdown */}
      <ListItemButton
        onClick={handlePayrollClick}
        sx={getDropdownStyles(isPayrollActive)}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: open ? 1.5 : 0,
            justifyContent: "center",
            color: "inherit",
            "& .MuiSvgIcon-root": {
              fontSize: "1.25rem",
            },
          }}
        >
          <AccountBalanceWalletIcon />
        </ListItemIcon>
        <ListItemText
          primary="Payroll"
          sx={{
            display: open ? "block" : "none",
            opacity: open ? 1 : 0,
            textDecoration: "none",
          }}
        />
        {open && (
          <ListItemIcon
            sx={{
              minWidth: 0,
              color: "inherit",
              ml: "auto",
            }}
          >
            {payrollOpen ? (
              <ExpandLess sx={{ fontSize: "1rem" }} />
            ) : (
              <ExpandMore sx={{ fontSize: "1rem" }} />
            )}
          </ListItemIcon>
        )}
      </ListItemButton>

      <Collapse in={payrollOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding sx={{ pl: open ? 2 : 0 }}>
          <NavItem
            link="/salary-transfer"
            open={open}
            label="Employee Payroll"
            icon={<Groups />}
          />
          <NavItem
            link="/payroll/master"
            open={open}
            label="Breaking Master"
            icon={<TableView />}
          />
          <NavItem
            link="/payroll/financial-year"
            open={open}
            label="Financial Year"
            icon={<CalendarMonthIcon />}
          />
        </List>
      </Collapse>

      <NavItem
        link="/attendance"
        open={open}
        label="Attendance"
        icon={<PlaylistAddCheckCircleOutlinedIcon />}
      />

      <NavItem
        link="/leaves"
        open={open}
        label="Leave"
        icon={<TodayRoundedIcon />}
      />

      {/* 🔽 Recruitment Dropdown */}
      <ListItemButton
        onClick={handleRecruitmentClick}
        sx={getDropdownStyles(isRecruitmentActive)}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: open ? 1.5 : 0,
            justifyContent: "center",
            color: "inherit",
            "& .MuiSvgIcon-root": {
              fontSize: "1.25rem",
            },
          }}
        >
          <PersonAdd />
        </ListItemIcon>
        <ListItemText
          primary="Recruitment"
          sx={{
            display: open ? "block" : "none",
            opacity: open ? 1 : 0,
            textDecoration: "none",
          }}
        />
        {open && (
          <ListItemIcon
            sx={{
              minWidth: 0,
              color: "inherit",
              ml: "auto",
            }}
          >
            {recruitmentOpen ? (
              <ExpandLess sx={{ fontSize: "1rem" }} />
            ) : (
              <ExpandMore sx={{ fontSize: "1rem" }} />
            )}
          </ListItemIcon>
        )}
      </ListItemButton>

      <Collapse in={recruitmentOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding sx={{ pl: open ? 2 : 0 }}>
          <NavItem
            link="/recruitment/jobs"
            open={open}
            label="Job List"
            icon={<WorkOutlineIcon />}
          />
          <NavItem
            link="/recruitment/applicants"
            open={open}
            label="Applicants"
            icon={<GroupIcon />}
          />
        </List>
      </Collapse>

      <NavItem
        link="/locations"
        open={open}
        label="Locations"
        icon={<ExploreRoundedIcon />}
      />

      <NavItem
        link="/report"
        open={open}
        label="Report"
        icon={<ReportGmailerrorredIcon />}
      />

      <NavItem
        link="/devices"
        open={open}
        label="Device Requests"
        icon={<DeviceUnknownIcon />}
      />

      <NavItem
        link="/time-management"
        open={open}
        label="Time Management"
        icon={<AccessTimeIcon />}
      />
    </List>
  );
}
