import { List, ListItem, ListItemIcon, Typography } from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import LeaveDetailCard from "../../leaves/components/cards/leave-detail-card";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { IHoliday } from "../../../api/dashboard/dashboar-types";

interface Props {
  holidays: IHoliday[];
}

export default function UpcomingHolidays(props: Props) {
  return (
    <LeaveDetailCard title="Upcoming Holidays">
      {props?.holidays?.length <= 0 && (
        <div>
          <Typography>No Holidays Found!</Typography>
        </div>
      )}

      <List>
        {props.holidays?.map((holiday) => (
          <ListItem
            key={holiday.id}
            disablePadding
            disableGutters
            secondaryAction={
              <Typography variant="body2" color="text.secondary">
                {holiday?.leaveDate}
              </Typography>
            }
          >
            <ListItemIcon>
              <CalendarMonthIcon color="action" />
            </ListItemIcon>
            <ListItemText
              secondary={holiday?.leaveName}
              secondaryTypographyProps={{
                noWrap: true,
                marginLeft: -3,
              }}
            />
          </ListItem>
        ))}
      </List>
    </LeaveDetailCard>
  );
}
