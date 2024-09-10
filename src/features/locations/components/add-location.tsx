import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import Input from "../../../components/ui/input";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postLocation } from "../../../api/location/location-api";
import { LoadingButton } from "@mui/lab";
import toast from "react-hot-toast";
import QUERY_KEYS from "../../../data/queryKeys";

const schema = yup
  .object({
    name: yup.string().required("Office Address is required"),
    lat1: yup
      .number()
      .min(-90, "Invalid Lattitude")
      .max(90, "Invalid Lattitude")
      .required("Lattitude  required"),
    lat2: yup
      .number()
      .min(-90, "Invalid Lattitude")
      .max(90, "Invalid Lattitude")
      .required("Lattitude  required"),
    lat3: yup
      .number()
      .min(-90, "Invalid Lattitude")
      .max(90, "Invalid Lattitude")
      .required("Lattitude  required"),
    lat4: yup
      .number()
      .min(-90, "Invalid Lattitude")
      .max(90, "Invalid Lattitude")
      .required("Lattitude  required"),
    long1: yup
      .number()
      .min(-180, "Invalid Longitude")
      .max(180, "Invalid Longitude")
      .required("Longitude  required"),
    long2: yup
      .number()
      .min(-180, "Invalid Longitude")
      .max(180, "Invalid Longitude")
      .required("Longitude  required"),
    long3: yup
      .number()
      .min(-180, "Invalid Longitude")
      .max(180, "Invalid Longitude")
      .required("Longitude  required"),
    long4: yup
      .number()
      .min(-180, "Invalid Longitude")
      .max(180, "Invalid Longitude")
      .required("Longitude  required"),
  })
  .required();

interface Props {
  open: boolean;
  closeHandler: () => void;
}

type FormValues = {
  name: string;
  lat1: number;
  long1: number;
  lat2: number;
  long2: number;
  lat3: number;
  long3: number;
  lat4: number;
  long4: number;
};

export default function AddLocation(props: Props) {
  const queryClint = useQueryClient();

  const { handleSubmit, control, reset } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: postLocation,
    onSuccess(data) {
      if (data.status === "success") {
        toast.success("Location added!");
        queryClint.invalidateQueries({
          queryKey: [QUERY_KEYS.LOCATIONS],
        });
        reset();
        props.closeHandler();
      } else {
        toast.error(data?.message ?? "Location add failed!");
      }
    },
    onError(error) {
      toast.error(error?.message ?? "Location add failed!");
    },
  });

  const onSubmit = (data: FormValues) => {
    mutate({
      ...data,
    });
  };

  return (
    <>
      <Dialog
        open={ props.open }
        onClose={ props.closeHandler }
        fullWidth
        maxWidth="md"
        component="form"
        onSubmit={ handleSubmit(onSubmit) }
      >
        <DialogTitle>Add New Location</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill in the details below to add new location.
          </DialogContentText>

          <Stack py={ 3 } gap={ 1 }>
            <Input
              control={ control }
              label="Location Name"
              name="locationName"
              placeholder="ADSM"
            />

            <Input
              control={ control }
              label="Location Address"
              name="name"
              placeholder="4P89+2C8, Bhabananda Boro Path,Katabari, Gorchuk, NH37, GARCHUK, Guwahati, Assam 781035"
            />

            <Divider sx={ { py: 2 } } />
            <Stack pt={ 2 }>
              <Typography variant="subtitle2">Geo-Fencing Points</Typography>

              <Grid container py={ 2 } spacing={ 2 }>
                <Grid item xs={ 12 } md={ 6 }>
                  <Input
                    control={ control }
                    name="lat1"
                    type="number"
                    label="Lattitude 1"
                    placeholder=""
                  />
                </Grid>
                <Grid item xs={ 12 } md={ 6 }>
                  <Input
                    control={ control }
                    name="long1"
                    type="number"
                    label="Longitude 1"
                    placeholder=""
                  />
                </Grid>
                <Grid item xs={ 12 } md={ 6 }>
                  <Input
                    control={ control }
                    name="lat2"
                    type="number"
                    label="Lattitude 2"
                    placeholder=""
                  />
                </Grid>
                <Grid item xs={ 12 } md={ 6 }>
                  <Input
                    control={ control }
                    name="long2"
                    type="number"
                    label="Longitude 2"
                    placeholder=""
                  />
                </Grid>
                <Grid item xs={ 12 } md={ 6 }>
                  <Input
                    control={ control }
                    name="lat3"
                    type="number"
                    label="Lattitude 3"
                    placeholder=""
                  />
                </Grid>
                <Grid item xs={ 12 } md={ 6 }>
                  <Input
                    control={ control }
                    name="long3"
                    type="number"
                    label="Longitude 3"
                    placeholder=""
                  />
                </Grid>
                <Grid item xs={ 12 } md={ 6 }>
                  <Input
                    control={ control }
                    name="lat4"
                    type="number"
                    label="Lattitude 4"
                    placeholder=""
                  />
                </Grid>
                <Grid item xs={ 12 } md={ 6 }>
                  <Input
                    control={ control }
                    name="long4"
                    type="number"
                    label="Longitude 4"
                    placeholder=""
                  />
                </Grid>
              </Grid>
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={ props.closeHandler }>Cancel</Button>
          <LoadingButton loading={ isPending } type="submit">
            Add Location
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
