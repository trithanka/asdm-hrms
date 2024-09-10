import PeopleIcon from "@mui/icons-material/People";
import {
  List,
  ListItem,
  ListItemIcon,
  Paper,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import * as React from "react";
import { useFetchEmployeeCount } from "../../report/hooks/useFetchEmployeeCount";
import { Link } from "react-router-dom";

type IType = "departmentWiseCount" | "designationWiseCount";

export default function EmployeesCount() {
  const [type, setType] = React.useState<IType>("departmentWiseCount");

  const { data } = useFetchEmployeeCount();

  const handleChange = (_: React.MouseEvent<HTMLElement>, newType: IType) => {
    setType(newType);
  };

  return (
    <>
      <Paper variant="outlined" sx={ { p: 3, height: "100%" } }>
        <Stack justifyContent="space-between" flexDirection="row" pb={ 1 }>
          <Typography variant="subtitle2">Employees</Typography>
          <ToggleButtonGroup
            color="primary"
            value={ type }
            exclusive
            onChange={ handleChange }
            aria-label="Platform"
            size="small"
          >
            <ToggleButton value="designationWiseCount">
              <Typography variant="button" textTransform="capitalize" px={ 1 }>
                Designation Wise
              </Typography>
            </ToggleButton>
            <ToggleButton value="departmentWiseCount">
              <Typography variant="button" textTransform="capitalize" px={ 1 }>
                Department Wise
              </Typography>
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>
        <List sx={ { overflow: "auto", height: 400 } }>
          { data &&
            data[type]?.map((employee: any) => (
              <ListItem
                secondaryAction={
                  <Typography fontWeight={ 500 } variant="h6">
                    <Link
                      style={ { color: "inherit", textDecoration: "none" } }
                      to={
                        type === "departmentWiseCount"
                          ? `/employeedata/?department=${employee.departmentId}`
                          : `/employeedata/?designation=${employee.department}`
                      }
                    >
                      { employee?.count }
                    </Link>
                  </Typography>
                }
              >
                <ListItemIcon>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    type === "departmentWiseCount"
                      ? employee.department
                      : employee.designationName
                  }
                  primaryTypographyProps={ { fontWeight: 500 } }
                />
              </ListItem>
            )) }
        </List>
      </Paper>
    </>
  );
}
