import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { exportPendingLeave } from "../../../api/leave/leave-api";

export default function useExportPendingLeaves() {
  const date = new Date();
  const formattedDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

  const { mutate, isPending } = useMutation({
    mutationFn: exportPendingLeave,
    onSuccess(data) {
      if (data?.status === "error") {
        toast.error(data?.message ?? "Something went wrong!");
        return;
      }

      const blob = new Blob([data], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pending-leaves-${formattedDate}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    },
    onError(error) {
      toast.error(error.message ?? "Something went wrong!");
    },
  });

  return {
    exportData: mutate,
    isPending,
  };
}
