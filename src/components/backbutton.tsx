import { ChevronLeft } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function BackButton({ link }: { link?: string }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (link) {
      navigate(link);
    } else {
      navigate(-1);
    }
  };

  return (
    <Button startIcon={<ChevronLeft />} onClick={handleBack}>
      Back
    </Button>
  );
}
