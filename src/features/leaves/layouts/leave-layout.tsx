import { Button, Grid, Stack, Typography } from "@mui/material";
import LeaveSkeleton from "../components/skeletons/leave-skeleton";
import LeaveActionCard from "../components/cards/leave-action-card";
import { ILeave, LeaveType } from "../../../api/leave/leave-types";
import useLeaves from "../hooks/useLeaves";
import ErrorIcon from "@mui/icons-material/Error";
import { useState } from "react";

interface ILeaveLayout {
  type: LeaveType;
  empId: string;
}

export default function LeaveLayout({ type, empId = "" }: ILeaveLayout) {
  const { isLoading, data: leaves } = useLeaves(type);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  if (isLoading) return <LeaveSkeleton />;

  const filteredLeaves = leaves?.data?.filter((leave: ILeave) =>
    leave.empCode.toString().toLowerCase().includes(empId.toLowerCase())
  );

  const totalPages = Math.ceil(filteredLeaves?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLeaves = filteredLeaves?.slice(startIndex, endIndex)

  return (
    <Grid container spacing={ 2 } component="section">
      { filteredLeaves?.length === 0 && (
        <Stack
          alignItems="center"
          justifyContent="center"
          gap={ 1 }
          pt={ 12 }
          pb={ 6 }
          width="100%"
        >
          <ErrorIcon fontSize="large" color="disabled" />
          <Typography
            variant="body2"
            align="center"
            color="text.secondary"
            textTransform="capitalize"
          >
            No { type } Leaves Found!
          </Typography>
        </Stack>
      ) }

      { currentLeaves?.map((leave: ILeave, index: number) => (
        <Grid item xs={ 12 } key={ index }>
          <LeaveActionCard leave={ leave } type={ type } index={ startIndex + index + 1 } />
        </Grid>
      )) }

      {/* Pagination Controls */ }
      { totalPages !== 0 &&
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={ 2 }
          mt={ 2 }
        >
          <Button variant="outlined"
            disabled={ currentPage === 1 }
            onClick={ () => setCurrentPage(currentPage - 1) }>
            Previous
          </Button>
          <Typography variant="body2">{ `Page ${currentPage} of ${totalPages}` }</Typography>

          <Button
            variant="outlined"
            disabled={ currentPage === totalPages || totalPages === 0 }
            onClick={ () => setCurrentPage(currentPage + 1) }>
            Next
          </Button>
        </Stack>
      }
    </Grid>
  );
}
