import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import QUERY_KEYS from "../../../data/queryKeys";
import { fetchAttendanceRateDepartmentWise } from "../../../api/dashboard/dashboard-api";
import toast from "react-hot-toast";

export default function useFetchAttendanceRateDepartmentWise() {
  const { isPending, data, isSuccess } = useQuery({
    queryKey: [QUERY_KEYS.ATTENDACE_RATE_DEPARTMENT_WISE],
    queryFn: fetchAttendanceRateDepartmentWise,
    meta: {
      errorMessage: "Failed to fetch dashboard data",
    },
  });

  const newData: any[] = [];

  data?.departmentWiseLeave?.forEach((item) => {
    const existingItem = newData.find(
      (element) => element.department === item.department
    );
    if (existingItem) {
      existingItem[item.type] = item.count;
    } else {
      const newItem: any = { department: item.department };
      newItem[item.type] = item.count;
      newData.push(newItem);
    }
  });

  // Remove 'count' keys from objects
  newData.forEach((item) => delete item?.count);

  React.useEffect(() => {
    if (isSuccess) {
      if (data?.status !== "success" && data?.status) {
        toast?.error(data?.message ?? "Something went wrong!");
      }
    }
  }, [isSuccess]);

  return { isPending, data: newData };
}
