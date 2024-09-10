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
        >
          {/* Profile */ }
          <Stack direction="row" gap={ 2 } alignItems={ "center" }>
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
          <Stack>
            <Typography variant="caption" align="center" color="primary.dark">
              Leave Type
            </Typography>
            <Typography variant="body2" fontWeight={ 700 } color="ActiveCaption" align="center">
              { prop?.leave?.type }
            </Typography>
          </Stack>
          { prop?.leave?.startDate &&
            <Stack>
              <Typography variant="caption" align="center" color="primary.dark">
                Start Date
              </Typography>
              <Typography variant="body2" fontWeight={ 700 }>
                { formatDate(prop?.leave?.startDate) }
              </Typography>
            </Stack>
          }
          { prop?.leave?.endDate &&
            <Stack>
              <Typography variant="caption" align="center" color="primary.dark">
                End Date
              </Typography>
              <Typography variant="body2" fontWeight={ 700 }>
                { formatDate(prop?.leave?.endDate) }
              </Typography>
            </Stack>
          }
          <Stack>
            <Typography variant="caption" align="center" color="primary.dark">
              Leave Days
            </Typography>
            <Typography variant="body2" align="center" fontWeight={ 700 }>
              { prop?.leave?.leaveDuration }
            </Typography>
          </Stack>
          <Stack>
            <Typography variant="caption" align="center" color="primary.dark">
              Applied On
            </Typography>
            <Typography variant="body2" fontWeight={ 700 }>
              { formatDate(prop?.leave?.appliedDate) }
            </Typography>
          </Stack>
          <Stack justifyContent="center" alignItems="center">
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
              <Typography variant="caption" align="center">
                N/A
              </Typography>
            ) }
            {/* <Link
              typography="caption"
              href={prop?.leave?.supporting}
              target="_blank"
            >
              {prop?.leave?.supporting ? "Supporting Document" : "N/A"}
            </Link> */}
          </Stack>
          { prop?.type === "pending" &&
            <Stack justifyContent="center" alignItems="center">
              <Typography variant="caption" align="center" color="text.dark">
                Leave Application
              </Typography>
              {/* { prop?.leave?.supporting ? ( */ }
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
              {/* ) : ( */ }
              {/* <Typography variant="caption" align="center">
                N/A
              </Typography> */}
              {/* ) } */ }
            </Stack>
          }
          {/* <Stack>
          <Typography
            variant="body2"
            fontWeight={700}
            align="center"
            color="primary"
          >
            5 days
          </Typography>
          <Typography variant="caption" color="GrayText" align="center">
            Nov 23, 2023 - Nov 28, 2023
          </Typography>
        </Stack> */}
          <Stack direction="row">
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
