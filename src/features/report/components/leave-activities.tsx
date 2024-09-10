import GroupIcon from "@mui/icons-material/Group";
import GroupRemoveIcon from "@mui/icons-material/GroupRemove";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import { List, ListItem, ListItemIcon, Typography } from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import LeaveDetailCard from "../../leaves/components/cards/leave-detail-card";
import { Link } from "react-router-dom";

interface Props {
  staffOnLeave: number;
  joiningToday: number;
  staffPresentToday: number;
  staffAbsentToday: number;
}

export default function LeaveActivities(props: Props) {
  return (
    <LeaveDetailCard title="Leave Activities">
      <List>
        <ListItem
          secondaryAction={
            <Typography fontWeight={700}>
              <Link
                style={{ textDecoration: "none", color: "inherit" }}
                to={"/leave-activity/?staff=leave"}
              >
                {props.staffOnLeave}
              </Link>
            </Typography>
          }
          disablePadding
        >
          <ListItemIcon>
            <PersonOffIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText
            secondary="Staff on Leave"
            secondaryTypographyProps={{
              fontWeight: 500,
              marginLeft: -3,
            }}
          />
        </ListItem>
        <ListItem
          secondaryAction={
            <Typography fontWeight={700}>
              <Link
                style={{ textDecoration: "none", color: "inherit" }}
                to={"/leave-activity/?staff=joined"}
              >
                {props.joiningToday}
              </Link>
            </Typography>
          }
          disablePadding
        >
          <ListItemIcon>
            <PersonAddIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText
            secondary="Joining Today"
            secondaryTypographyProps={{
              fontWeight: 500,
              marginLeft: -3,
            }}
          />
        </ListItem>
        <ListItem
          secondaryAction={
            <Typography fontWeight={700}>
              <Link
                style={{ textDecoration: "none", color: "inherit" }}
                to={"/leave-activity/?staff=present"}
              >
                {props.staffPresentToday}
              </Link>
            </Typography>
          }
          disablePadding
        >
          <ListItemIcon>
            <GroupIcon fontSize="small" color="success" />
          </ListItemIcon>
          <ListItemText
            secondary="Staff Present Today"
            secondaryTypographyProps={{
              fontWeight: 500,
              marginLeft: -3,
            }}
          />
        </ListItem>
        <ListItem
          secondaryAction={
            <Typography fontWeight={700}>
              <Link
                style={{ textDecoration: "none", color: "inherit" }}
                to={"/leave-activity/?staff=absent"}
              >
                {props.staffAbsentToday}
              </Link>
            </Typography>
          }
          disablePadding
        >
          <ListItemIcon>
            <GroupRemoveIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText
            secondary="Staff Absent Today"
            secondaryTypographyProps={{
              fontWeight: 500,
              marginLeft: -3,
            }}
          />
        </ListItem>
      </List>
    </LeaveDetailCard>
  );
}
