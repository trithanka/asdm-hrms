import { Outlet, createBrowserRouter } from "react-router-dom";
import RootLayout from "./layouts/root-layout";
import Employees from "./pages/employees";
import ErrorPage from "./pages/error";
import Home from "./pages/home";
import Leaves from "./pages/leaves";
import LeavesList from "./features/employees/pages/leaves-list";
import Locations from "./pages/locations";
import Auth from "./pages/auth";
import { RequireAuth } from "react-auth-kit";
import AddEmployee from "./features/employees/components/add-employee";
import Success from "./pages/success";
import Employeedata from "./pages/employeedata";
import EmployeeActivity from "./pages/employeeactivity";
import EmployeeDetail from "./pages/employeedetail";
import MonthlyAttendance from "./features/dashboard/components/monthly-attendance";
import ReportPage from "./features/report/page";
import NewDevicesList from "./features/employees/components/new-devices-list";
import LeaveApplication from "./pdf/application";
import UserManage from "./pages/usermanage";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <RequireAuth loginPath={ "/login" }>
        <RootLayout />
      </RequireAuth>
    ),
    errorElement: <ErrorPage />,

    
    children: [
      {
        
        index: true,
        element: <Home />,
      },
      
    
      {
        path: "employees",
        element: <Outlet />,
        children: [
          {
            index: true,
            element: <Employees />,
          },
          {
            path: "leaves",
            element: <LeavesList />,
          },
          {
            path: "register",
            element: <AddEmployee />,
          },
         
          {
            path: ":empId",
            element: <EmployeeDetail />,
          },
        ],
      },
      {
        path: "leaves",
        element: <Leaves />,
      },
      {
        path: "locations",
        element: <Locations />,
      },
      {
        path: "success",
        element: <Success />,
      },
      {
        path: "employeedata",
        element: <Employeedata />,
      },
      {
        path: "attendance",
        element: <MonthlyAttendance />,
      },
      {
        path: "report",
        element: <ReportPage />
      },
      {
        path: "leave-activity",
        element: <EmployeeActivity />,
      },
      {
        path: "devices",
        element: <NewDevicesList />
      },
      {
        path: "application/:id",
        element: <LeaveApplication />
      },
    ],
  },
  {
    path: "login",
    element: <Auth />,
  },
  {
    path: "UserManage",
    element: <UserManage />,
  },
 
 
]);

export default router;
