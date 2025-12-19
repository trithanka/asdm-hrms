import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  Avatar,
  IconButton,
  Link as MuiLink,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import React from "react";
import { ILeave, LeaveType } from "../../../../api/leave/leave-types";
import Drawer from "../../../../components/ui/drawer";
import LeaveDetail from "../../leave-detail";
import { Link } from "react-router-dom";
import { formatDate } from "../../../../utils/formatter";

interface IProp {
  leave: ILeave;
  type: LeaveType;
  index: number;
}




export default function LeaveActionCard(prop: IProp) {
  const [open, setOpen] = React.useState(false);


  const closeDrawer = () => setOpen(false);
  const openDrawer = () => setOpen(true);

  return (
    <>
      <Paper variant="outlined">
        <Stack
          bgcolor={ grey[50] }
          px={ 3 }
          py={ 2 }
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          gap={ 2 }
        >
          {/* Profile */ }
          <Stack direction="row" gap={ 2 } alignItems={ "center" } minWidth={ 180 } flex={ 1 }>
            <Typography variant="body1" mr={ 2 } textAlign={ "center" }>
              { prop.index }
            </Typography>
            <Avatar />
            <Stack>
              <Typography
                variant="body2"
                fontWeight={ 600 }
                textTransform="capitalize"
              >
                { prop?.leave?.name }
              </Typography>

            </Stack>
          </Stack>
          <Stack minWidth={ 100 } alignItems="center">
            <Typography variant="caption" align="center" color="primary.dark">
              Leave Type
            </Typography>
            <Typography variant="body2" fontWeight={ 700 } color="ActiveCaption" align="center">
              { prop?.leave?.type }
            </Typography>
          </Stack>
          <Stack minWidth={ 100 } alignItems="center">
            <Typography variant="caption" align="center" color="primary.dark">
              Start Date
            </Typography>
            <Typography variant="body2" fontWeight={ 700 } align="center">
              { prop?.leave?.startDate ? formatDate(prop?.leave?.startDate) : "N/A" }
            </Typography>
          </Stack>
          <Stack minWidth={ 100 } alignItems="center">
            <Typography variant="caption" align="center" color="primary.dark">
              End Date
            </Typography>
            <Typography variant="body2" fontWeight={ 700 } align="center">
              { prop?.leave?.endDate ? formatDate(prop?.leave?.endDate) : "N/A" }
            </Typography>
          </Stack>
          <Stack minWidth={ 80 } alignItems="center">
            <Typography variant="caption" align="center" color="primary.dark">
              Leave Days
            </Typography>
            <Typography variant="body2" align="center" fontWeight={ 700 }>
              { prop?.leave?.leaveDuration }
            </Typography>
          </Stack>
          <Stack minWidth={ 100 } alignItems="center">
            <Typography variant="caption" align="center" color="primary.dark">
              Applied On
            </Typography>
            <Typography variant="body2" fontWeight={ 700 } align="center">
              { formatDate(prop?.leave?.appliedDate) }
            </Typography>
          </Stack>
          <Stack minWidth={ 120 } justifyContent="center" alignItems="center">
            <Typography variant="caption" align="center" color="text.dark">
              Supporting Document
            </Typography>
            { prop?.leave?.supporting ? (
              <MuiLink
                typography="caption"
                href={ prop?.leave?.supporting }
                target="_blank"
              >
                <Typography
                  variant="body2"
                  fontWeight={ 500 }
                  color="primary.main"
                >
                  Download
                </Typography>
              </MuiLink>
            ) : (
              <Typography variant="body2" fontWeight={ 500 } align="center">
                N/A
              </Typography>
            ) }
          </Stack>
          <Stack minWidth={ 120 } justifyContent="center" alignItems="center">
            <Typography variant="caption" align="center" color="text.dark">
              Leave Application
            </Typography>
            { prop?.type === "pending" ? (
              <Link
                to={ `/application/${prop?.leave?.applicationId}` }
              >
                <Typography
                  variant="body2"
                  fontWeight={ 500 }
                  color="primary.main"
                >
                  View & Download
                </Typography>
              </Link>
            ) : (
              <Typography variant="body2" fontWeight={ 500 } align="center">
                N/A
              </Typography>
            ) }
          </Stack>
          <Stack direction="row" minWidth={ 48 } justifyContent="center">
            <Tooltip title="More">
              <IconButton color="primary" onClick={ openDrawer }>
                <ChevronRightIcon fontSize="small" color="inherit" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </Paper>

      <Drawer open={ open } handleDrawerClose={ closeDrawer }>
        <LeaveDetail
          id={ prop?.leave?.applicationId }
          employeeId={ prop.leave.empCode }
          type={ prop.type }
          leave={ prop.leave }
          closeDrawer={ closeDrawer }
          appliedDate={ prop.type === "approved" ? prop?.leave?.appliedDate : undefined }
        />
      </Drawer>
    </>
  );
}
