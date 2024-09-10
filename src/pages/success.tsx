import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { useLocation, useNavigate, Navigate } from "react-router-dom";

export default function Success() {
  const location = useLocation();
  const navigate = useNavigate();
  const message = location.state?.message;
  const redirectToHome = () => navigate("/");

  if (!message) {
    return <Navigate to="/" />;
  }

  return (
    <Container maxWidth="sm">
      <Stack
        height="80vh"
        justifyContent="center"
        alignItems="center"
        gap={2}
        color="success.main"
      >
        <Box width={50}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            // className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
            />
          </svg>
        </Box>
        <Typography color="text.primary" variant="body2">
          {message}
        </Typography>

        <Button onClick={redirectToHome}>Go to Home</Button>
      </Stack>
    </Container>
  );
}
