import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Container, Paper, Stack, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { useMutation } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { useSignIn } from "react-auth-kit";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { login } from "../../api/authenticate";
import Input from "../../components/ui/input";

type FormValues = {
  username: string;
  password: string;
};

const schema = yup
  .object({
    username: yup.string().required("Name is required"),
    password: yup.string().required("Password is required"),
  })
  .required();

export default function SignInPage() {
  const signIn = useSignIn();
  const navigate = useNavigate();

  const { handleSubmit, control } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      password: "",
      username: "",
      //   password: "123456",
      //   username: "test",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess(data) {
      if (data?.status === false) {
        toast.error(data?.message ?? "Login failed");
      }
      if (data?.status === "failed" || data?.status === "error") {
        toast.error(data?.message ?? "Something went wrong");
        return;
      }
      const decoded = jwtDecode(data.token);
      if (
        signIn({
          token: data.token,
          expiresIn: 1200,
          tokenType: "Bearer",
          authState: decoded,
        })
      ) {
        toast.success(data?.message ?? "Login Successfull");
        localStorage.setItem("name", data.name);

        if (data.systemUser === true) {
          navigate("/usermanage");
        } else if (data.systemUser === false) {
          navigate("/");
        }
      } else {
        toast.error("Login Failure");
      }
    },
    onError(error) {
      console.error(error?.message ?? "Something went wrong");
    },
  });

  const onSubmit = (data: FormValues) => {
    mutate({
      password: data.password,
      username: data.username,
    });
  };

  return (
    <Stack
      minHeight="100vh"
      minWidth="100vw"
      alignItems="center"
      justifyContent="center"
      bgcolor={grey[100]}
    >
      <Container maxWidth="sm">
        <Paper
          variant="outlined"
          sx={{ px: 6, py: 3 }}
          component="form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Typography variant="h4" fontWeight={700} color="primary.dark" pt={2}>
            HRMS
          </Typography>
          <Typography variant="h6" color="text.secondary" pb={4}>
            Login with your admin account
          </Typography>
          <Stack pb={2} gap={3}>
            <Input
              control={control}
              label="User Name"
              name="username"
              placeholder="Please enter your username"
            />

            <Input
              control={control}
              label="Password"
              name="password"
              type="password"
              placeholder="Please enter your password"
            />

            <LoadingButton
              loading={isPending}
              variant="contained"
              fullWidth
              size="large"
              type="submit"
              sx={{ mt: 3 }}
            >
              Sign In
            </LoadingButton>
          </Stack>
        </Paper>
      </Container>
    </Stack>
  );
}
