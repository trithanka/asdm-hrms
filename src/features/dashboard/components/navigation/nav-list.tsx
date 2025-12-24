import { useState } from "react";
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
import NavItem from "./nav-item";

interface INavList {
  open: boolean;
}

export default function NavList({ open }: INavList) {
  const [recruitmentOpen, setRecruitmentOpen] = useState(false);

  const handleRecruitmentClick = () => {
    setRecruitmentOpen(!recruitmentOpen);
  };

  return (
    <List>
      <NavItem
        link="/"
        open={open}
        label="Dashboard"
        icon={<DashboardRoundedIcon color="primary" />}
      />

      <NavItem
        link="/employees"
        open={open}
        label="Employee List"
        icon={<PeopleRoundedIcon color="success" />}
      />

      <NavItem
        link="/attendance"
        open={open}
        label="Attendance"
        icon={<PlaylistAddCheckCircleOutlinedIcon color="primary" />}
      />

      <NavItem
        link="/leaves"
        open={open}
        label="Leave"
        icon={<TodayRoundedIcon color="warning" />}
      />

      {/* 🔽 Recruitment Dropdown */}
      <ListItemButton onClick={handleRecruitmentClick}>
        <ListItemIcon>
          <TodayRoundedIcon color="warning" />
        </ListItemIcon>
        <ListItemText primary="Recruitment" />
        {recruitmentOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      <Collapse in={recruitmentOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding sx={{ pl: 4 }}>
          <NavItem
            link="/recruitment/jobs"
            open={open}
            label="Job List"
            icon={<WorkOutlineIcon color="primary" />}
          />
          <NavItem
            link="/recruitment/applicants"
            open={open}
            label="Applicants"
            icon={<GroupIcon color="secondary" />}
          />
        </List>
      </Collapse>

      <NavItem
        link="/locations"
        open={open}
        label="Locations"
        icon={<ExploreRoundedIcon color="error" />}
      />

      <NavItem
        link="/report"
        open={open}
        label="Report"
        icon={<ReportGmailerrorredIcon color="error" />}
      />

      <NavItem
        link="/devices"
        open={open}
        label="Device Requests"
        icon={<DeviceUnknownIcon color="primary" />}
      />

      <NavItem
        link="/time-management"
        open={open}
        label="Time Management"
        icon={<AccessTimeIcon color="info" />}
      />
    </List>
  );
}
