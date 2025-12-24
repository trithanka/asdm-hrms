import * as React from "react";
import { LoadingButton } from "@mui/lab";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { leaveApprove, leaveTApprove } from "../../api/leave/leave-api";
import { ILeave, LeaveType } from "../../api/leave/leave-types";
import { LEAVE_TYPE } from "../../data/constants";
import QUERY_KEYS from "../../data/queryKeys";
import { formatToLongDate, formatToMediumDate } from "../../utils/formatter";
import LeaveDetailCard from "./components/cards/leave-detail-card";
import useLeaveDetail from "./hooks/useLeaveDetail";

interface ILeaveDetail {
  id: string | number;
  type: LeaveType;
  closeDrawer: () => void;
  leave: ILeave;
  employeeId: number;
  appliedDate?: string;
}

export default function LeaveDetail({
  id,
  type,
  closeDrawer,
  leave,
  employeeId,
  appliedDate,
}: ILeaveDetail) {
  const [open, setOpen] = React.useState(false);
  const [leaveReason, setLeaveReason] = React.useState<string>();
  const [selectedFile, setSelectedFile] = React.useState<File | null>();
  const [selectedApplicationId, setSelectedApplicationId] = React.useState<number | null>(null);
  // Track day-wise decisions: { applicationId: 'approved' | 'rejected' }
  const [leaveDecisions, setLeaveDecisions] = React.useState<Record<number, 'approved' | 'rejected'>>({});

  const { isLoading, data } = useLeaveDetail(
    id,
    
    leave.type,
    type,
    employeeId,
    appliedDate
  );

  const theme = useTheme();
  const queryClient = useQueryClient();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { mutate: Tmutate, isPending: loading } = useMutation({
    mutationFn: leaveTApprove,
    onSuccess(data) {
      if (data?.message === "successful") {
        toast.success(data?.message);
        setLeaveReason("");
        closeDialog();
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.LEAVE_DETAIL, id, type],
        });
      } else if (data?.status === "failed") {
        toast.error(data?.message);
      } else {
        toast.error(data?.message);
      }
    },
    onError(error) {
      toast.error(error?.message ?? "Something went wrong");
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: leaveApprove,
    onSuccess(data) {
      if (data?.status === "success") {
        toast.success(data?.message);
        setLeaveReason("");
        closeDialog();
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.LEAVES, type],
        });
        closeDrawer();
      } else if (data?.status === "failed") {
        toast.error(data?.message);
      } else {
        toast.error(data?.message);
      }
    },
    onError(error) {
      toast.error(error?.message ?? "Something went wrong");
    },
  });

  function approve() {
    mutate({
      id: 1,
      type: leave.type,
      employeeId,
      reason: null,
      file: selectedFile,
    });
  }

  function Tapprove(applicationId: any) {
    Tmutate({
      id: applicationId,
      type: leave.type,
      Tapprove: 1,
      reason: null,
    });
    // Track decision locally
    setLeaveDecisions(prev => ({ ...prev, [applicationId]: 'approved' }));
  }

  function reject() {
    if (!leaveReason?.trim())
      return toast.error(
        "Please enter the reason for rejecting this leave request."
      );

    if (!selectedApplicationId) {
      return toast.error("No leave application selected.");
    }

    Tmutate({
      id: selectedApplicationId,
      type: leave.type,
      Tapprove: 0,
      reason: leaveReason!,
    });
    // Track decision locally
    setLeaveDecisions(prev => ({ ...prev, [selectedApplicationId]: 'rejected' }));
  }

  function openDialog(applicationId: number) {
    setSelectedApplicationId(applicationId);
    setOpen(true);
  }

  function closeDialog() {
    setOpen(false);
    setSelectedApplicationId(null);
  }

  const handleClick = (applicationId: any) => {
    Tapprove(applicationId);
  };

  // Approve all leave items
  const handleApproveAll = () => {
    if (!data?.leaveHistory) return;
    const newDecisions: Record<number, 'approved' | 'rejected'> = {};
    data.leaveHistory.forEach(lea => {
      Tmutate({
        id: lea.applicationId,
        type: leave.type,
        Tapprove: 1,
        reason: null,
      });
      newDecisions[lea.applicationId] = 'approved';
    });
    setLeaveDecisions(prev => ({ ...prev, ...newDecisions }));
  };

  // Reject all leave items
  const handleRejectAll = () => {
    if (!data?.leaveHistory) return;
    const newDecisions: Record<number, 'approved' | 'rejected'> = {};
    data.leaveHistory.forEach(lea => {
      Tmutate({
        id: lea.applicationId,
        type: leave.type,
        Tapprove: 0,
        reason: null,
      });
      newDecisions[lea.applicationId] = 'rejected';
    });
    setLeaveDecisions(prev => ({ ...prev, ...newDecisions }));
  };

  // Check if all leave items have been decided (approved or rejected)
  const allItemsDecided = React.useMemo(() => {
    if (!data?.leaveHistory || data.leaveHistory.length === 0) return false;
    return data.leaveHistory.every(lea => leaveDecisions[lea.applicationId] !== undefined);
  }, [data?.leaveHistory, leaveDecisions]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleUploadDocument = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target) return;

    const file = e.target.files && e.target.files[0];

    if (!(file?.type === "application/pdf"))
      return toast.error("Only PDF file is allowed");

    setSelectedFile(file);
  };

  return (
    <>
      <Stack gap={2} component="section" p={3} width={isMobile ? "100vw" : 600}>
        <LeaveDetailCard title="Leave Balance">
          <Grid container>
            <Grid item xs={4}>
              <Typography variant="body2">
                <Typography
                  variant="h4"
                  component="span"
                  fontWeight={700}
                  color="primary.main"
                >
                  {data?.data?.remaingCasualLeave || 0}
                </Typography>
                /{data?.data?.AssignedCasualLeave || 0} Days
              </Typography>
              <Typography variant="body2">Casual Leave</Typography>
            </Grid>

            <Grid item xs={4}>
              <Typography variant="body2">
                <Typography
                  variant="h4"
                  component="span"
                  fontWeight={700}
                  color="primary.main"
                >
                  {data?.data?.remaingSickLeave || 0}
                </Typography>
                /{data?.data?.AssignedSickLeave || 0} Days
              </Typography>
              <Typography variant="body2">Medical Leave</Typography>
            </Grid>

            <Grid item xs={4}>
              <Typography variant="body2">
                <Typography
                  variant="h4"
                  component="span"
                  fontWeight={700}
                  color="primary.main"
                >
                  {data?.data?.remaingParentalLeave || 0}
                </Typography>
                /{data?.data?.AssignedParentalLeave || 0} Days
              </Typography>
              <Typography variant="body2">Parental Leave</Typography>
            </Grid>


            <Grid item xs={4}>
              <Typography variant="body2">
                <Typography
                  variant="h4"
                  component="span"
                  fontWeight={700}
                  color="primary.main"
                >
                  {data?.data?.remaingUnpaidLeave || 0}
                </Typography>
                /{data?.data?.AssignedunpaidLeave || 0} Days
              </Typography>
              <Typography variant="body2">Unpaid Leave</Typography>
            </Grid>

            <Grid item xs={4}>
              <Typography variant="body2">
                <Typography
                  variant="h4"
                  component="span"
                  fontWeight={700}
                  color="primary.main"
                >
                  {data?.data?.remaingRestrictedLeave || 0}
                </Typography>
                /{data?.data?.AssignedrestrictedLeave || 0} Days
              </Typography>
              <Typography variant="body2">Restricted Leave</Typography>
            </Grid>

            <Grid item xs={4}>
              <Typography variant="body2">
                <Typography
                  variant="h4"
                  component="span"
                  fontWeight={700}
                  color="primary.main"
                >
                  {data?.data?.remaingMaternityLeave || 0}
                </Typography>
                /{data?.data?.AssignedMaternityLeave || 0} Days
              </Typography>
              <Typography variant="body2">Maternity Leave</Typography>
            </Grid>


          </Grid>
        </LeaveDetailCard>

        <LeaveDetailCard title="Leave Detail">
          <Stack direction="row" gap={2}>
            <Avatar />
            <Stack>
              <Typography variant="body2" textTransform="capitalize">
                {data?.data?.name}
              </Typography>
              <Typography variant="caption" color="GrayText">
                {data?.data?.email}
              </Typography>
            </Stack>
          </Stack>

          <Grid container paddingY={3} spacing={2}>
            <Grid item xs={6}>
              <Typography
                variant="body2"
                color="text.secondary"
                textTransform="capitalize"
              >
                Leave Type
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                variant="body2"
                textTransform="capitalize"
                fontWeight={500}
              >
                {data?.data?.leaveType && LEAVE_TYPE[data?.data?.leaveType]}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography
                variant="body2"
                color="text.secondary"
                textTransform="capitalize"
              >
                Duration
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                variant="body2"
                textTransform="capitalize"
                fontWeight={500}
              >
                {data?.data?.duration} days
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography
                variant="body2"
                color="text.secondary"
                textTransform="capitalize"
              >
                Reason
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                variant="body2"
                textTransform="capitalize"
                fontWeight={500}
              >
                {data?.data?.reason}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography
                variant="body2"
                color="text.secondary"
                textTransform="capitalize"
              >
                Phone
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                variant="body2"
                textTransform="capitalize"
                fontWeight={500}
              >
                {data?.data?.phoneNumber}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography
                variant="body2"
                color="text.secondary"
                textTransform="capitalize"
              >
                Applied On
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                variant="body2"
                textTransform="capitalize"
                fontWeight={500}
              >
                {formatToLongDate(data?.data?.appliedDate!)}
              </Typography>
            </Grid>
          </Grid>

          {/* { type === "pending" && (
            <Stack direction="row" gap={ 1 } pt={ 3 }>
              <LoadingButton
                loading={ isPending }
                variant="outlined"
                color="error"
                fullWidth
                // onClick={reject}
                onClick={ openDialog }
                disabled={ type !== "pending" }
              >
                Reject
              </LoadingButton>

              <LoadingButton
                loading={ isPending }
                variant="contained"
                fullWidth
                color="primary"
                onClick={ approve }
                disabled={ type !== "pending" }
              >
                Approve
              </LoadingButton>
            </Stack>
          ) } */}
        </LeaveDetailCard>

        <LeaveDetailCard
          title={
            type === "pending"
              ? "Pending Leave"
              : type === "approved"
                ? "Approve List"
                : type === "rejected"
                  ? "Rejected list"
                  : "List"
          }
        >
          {/* Approve All / Reject All buttons */}
          {type === "pending" && data?.leaveHistory && data.leaveHistory.length > 0 && (
            <Stack direction="row" gap={1} mb={2}>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={handleApproveAll}
                disabled={data.leaveHistory.every(lea => leaveDecisions[lea.applicationId] === 'approved')}
              >
                Approve All
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={handleRejectAll}
                disabled={data.leaveHistory.every(lea => leaveDecisions[lea.applicationId] === 'rejected')}
              >
                Reject All
              </Button>
            </Stack>
          )}
          <Grid container spacing={1}>
            {data?.leaveHistory?.map((lea, index: number) => (
              <Grid
                item
                container
                xs={12}
                key={index}
                borderBottom={0.5}
                p={1}
                borderColor="ButtonHighlight"
                sx={{
                  "&:last-child": {
                    border: "none",
                  },
                }}
              >
                <Grid item xs={1}>
                  <Typography variant="body2">{index + 1}</Typography>
                </Grid>

                <Grid item xs={4}>
                  <Typography variant="body2" color="GrayText">
                    {leave.type === "PL" ? (
                      <>
                        <span>
                          <span style={{ color: "black", fontWeight: 600 }}>
                            From:
                          </span>{" "}
                          {formatToMediumDate(lea.startDate)}
                        </span>
                        <br />
                        <span>
                          <span style={{ color: "black", fontWeight: 600 }}>
                            To:
                          </span>{" "}
                          {formatToMediumDate(lea.endDate)}
                        </span>
                      </>
                    ) : (
                      formatToMediumDate(lea.leaveDate)
                    )}
                  </Typography>
                </Grid>

                <Grid item xs={4}>
                  <Typography variant="body2">
                    {LEAVE_TYPE[lea.leaveType || lea.type]}
                  </Typography>
                </Grid>
                {type === "pending" && (
                  <Grid item xs={2}>
                    {/* <Typography variant="caption" color="error.main">
                     { lea.status }
                  </Typography> */}
                    <Stack height={25} direction="row" gap={1}>
                      <LoadingButton
                        loading={loading && selectedApplicationId === lea.applicationId}
                        variant="contained"
                        color={
                          leaveDecisions[lea.applicationId] === 'approved' ? "success" : "primary"
                        }
                        onClick={() => {
                          setSelectedApplicationId(lea.applicationId);
                          handleClick(lea.applicationId);
                        }}
                        disabled={
                          type !== "pending" || leaveDecisions[lea.applicationId] === 'approved'
                        }
                        style={{ fontSize: "10px" }}
                      >
                        {leaveDecisions[lea.applicationId] === 'approved' ? "Approved" : "Approve"}
                      </LoadingButton>
                      <LoadingButton
                        loading={isPending && selectedApplicationId === lea.applicationId}
                        variant="outlined"
                        color={
                          leaveDecisions[lea.applicationId] === 'rejected' ? "success" : "error"
                        }
                        onClick={() => openDialog(lea.applicationId)}
                        disabled={
                          type !== "pending" || leaveDecisions[lea.applicationId] === 'rejected'
                        }
                      >
                        <p style={{ fontSize: "10px" }}>
                          {leaveDecisions[lea.applicationId] === 'rejected' ? "Rejected" : "Reject"}
                        </p>
                      </LoadingButton>
                    </Stack>
                  </Grid>
                )}
              </Grid>
            ))}
            {type === "pending" && (
              <>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                    marginTop: "1rem",
                  }}
                >
                  <div>
                    Supporting Docs <small>(PDF)</small>
                  </div>
                  <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    width={"100%"}
                  >
                    <div>
                      <Button variant="contained" sx={{ mr: 2 }}>
                        <label htmlFor="supportingDoc">
                          Upload Document
                          <input
                            type="file"
                            id="supportingDoc"
                            onChange={handleUploadDocument}
                            style={{ display: "none" }}
                          />
                        </label>
                      </Button>
                      {selectedFile ? (
                        <span style={{ fontSize: "14px" }}>
                          {selectedFile.name}
                        </span>
                      ) : null}
                    </div>
                    {selectedFile && (
                      <Button
                        onClick={() => setSelectedFile(null)}
                        sx={{ color: "red" }}
                      >
                        X
                      </Button>
                    )}
                  </Box>
                </div>

                <Grid
                  px={20}
                  py={2}
                  display="flex"
                  gap={2}
                  alignContent="center"
                  justifyContent="space-between"
                >
                  <LoadingButton variant="outlined" onClick={approve} disabled={!allItemsDecided}>
                    Submit
                  </LoadingButton>
                  <LoadingButton
                    loading={isPending}
                    variant="outlined"
                    onClick={() => closeDrawer()}
                    color="error"
                  >
                    Cancel
                  </LoadingButton>
                </Grid>
              </>
            )}
          </Grid>
        </LeaveDetailCard>
      </Stack>

      <Dialog open={open} onClose={closeDialog}>
        <DialogTitle>Reject Reason</DialogTitle>

        <DialogContent>
          <DialogContentText paddingBottom={3}>
            You are about to reject the leave request of{" "}
            <Typography fontWeight={700} component="span">
              {leave.name}
            </Typography>
            . Please enter the reason for rejecting this leave request.
          </DialogContentText>

          <TextField
            minRows={2}
            multiline
            fullWidth
            placeholder="Type here..."
            value={leaveReason}
            onChange={(e) => setLeaveReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            color="error"
            onClick={() => {
              setLeaveReason("");
              closeDialog();
            }}
          >
            Cancel
          </Button>
          <Button onClick={reject}>Submit</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
