import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import TodayRoundedIcon from "@mui/icons-material/TodayRounded";
import PlaylistAddCheckCircleOutlinedIcon from '@mui/icons-material/PlaylistAddCheckCircleOutlined';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import DeviceUnknownIcon from '@mui/icons-material/DeviceUnknown';
import List from "@mui/material/List";
import NavItem from "./nav-item";

interface INavList {
  open: boolean;
}

export default function NavList({ open }: INavList) {
  return (
    <>
      <List>
        <NavItem
          link="/"
          open={ open }
          label="Dashboard"
          icon={ <DashboardRoundedIcon color="primary" /> }
        />

        <NavItem
          link="/employees"
          open={ open }
          label="Employee List"
          icon={ <PeopleRoundedIcon color="success" /> }
        />

        <NavItem
          link="/attendance"
          open={ open }
          label="Attendance"
          icon={ <PlaylistAddCheckCircleOutlinedIcon color="primary" /> }
        />


        <NavItem
          link="/leaves"
          open={ open }
          label="Leave"
          icon={ <TodayRoundedIcon color="warning" /> }
        />

        <NavItem
          link="/locations"
          open={ open }
          label="Locations"
          icon={ <ExploreRoundedIcon color="error" /> }
        />

        <NavItem
          link="/report"
          open={ open }
          label="Report"
          icon={ <ReportGmailerrorredIcon color="error" /> }
        />

        <NavItem
          link="/devices"
          open={ open }
          label="Device Requests"
          icon={ <DeviceUnknownIcon color="primary" /> }

        />

      </List>
    </>
  );
}
