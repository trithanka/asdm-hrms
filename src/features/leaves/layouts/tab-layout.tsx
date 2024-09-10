import { Box } from "@mui/material";
import { LeaveType } from "../../../api/leave/leave-types";
import LeaveLayout from "./leave-layout";

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  type: LeaveType;
  empId: string;
}

export function TabLayout(props: TabPanelProps) {
  const { children, value, index, type, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={ value !== index }
      id={ `simple-tabpanel-${index}` }
      aria-labelledby={ `leave-tab-${index}` }
      { ...other }
    >
      { value === index && (
        <Box sx={ { p: 3 } }>
          <LeaveLayout type={ type } empId={ props.empId } />
        </Box>
      ) }
    </div>
  );
}
