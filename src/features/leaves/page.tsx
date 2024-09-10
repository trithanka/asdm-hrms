import * as React from "react";
import { Input, Paper, Stack, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { TabLayout } from "./layouts/tab-layout";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { LoadingButton } from "@mui/lab";
import useExportPendingLeaves from "./hooks/useExportPendingLeaves";
import { useSearchParams } from "react-router-dom";
import BackButton from "../../components/backbutton";
import useDebounce from "../../hooks/useDebounce";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
export default function LeavesPage() {
  const [searchParam] = useSearchParams();

  const searchTypeName = searchParam.get("type");
  const searchType =
    searchTypeName === "approve" ? 1 : searchTypeName === "rejected" ? 2 : 0;

  const [value, setValue] = React.useState(0);
  const { exportData, isPending } = useExportPendingLeaves();
  const [filter, setFilter] = React.useState("");

  const debouncedFilter = useDebounce(filter, 500);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  React.useEffect(() => {
    if (searchType) {
      setValue(searchType);
    } else {
      setValue(0);
    }
  }, [searchType]);

  return (
    <>
      <Stack direction="row" justifyContent="space-between" pb={ 2 }>
        <BackButton />
        <Typography textAlign={ "center" } fontSize={ 20 } fontWeight={ 500 }>Leaves</Typography>
        <Stack direction="row" gap={ 2 }>
          <LoadingButton
            startIcon={ <FileDownloadIcon /> }
            variant="contained"
            loading={ isPending }
            onClick={ () => exportData() }
          >
            Export Pending Leaves
          </LoadingButton>

          <LoadingButton
            startIcon={ <FileDownloadIcon /> }
            variant="contained"
            loading={ isPending }
            onClick={ () => exportData() }
          >
            Export Request Approval
          </LoadingButton>
        </Stack>
      </Stack >
      <Paper variant="outlined">
        <Box
          sx={ {
            borderBottom: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingRight: 3,
          } }
        >
          <Tabs
            value={ value }
            onChange={ handleChange }
            aria-label="basic tabs example"
          >
            <Tab label="Pending" { ...a11yProps(0) } sx={ { fontWeight: 600 } } />
            <Tab label="Approved" { ...a11yProps(1) } sx={ { fontWeight: 600 } } />
            <Tab label="Rejected" { ...a11yProps(2) } sx={ { fontWeight: 600 } } />
          </Tabs>
          <Box sx={ {
            display: "flex",
            alignItems: "center",
            gap: "2rem",
          } }>
            <Box sx={ {
              display: "flex",
              alignContent: "center"
            } }>
              <Typography>Sort by:</Typography>
              <select name="" id="">
                <option value="newest">newest</option>
                <option value="oldest">oldest</option>
              </select>
            </Box>
            <Input
              type="text"
              placeholder="Search Employee Id"
              value={ filter }
              onChange={ (e) => setFilter(e.target.value) }
            />
          </Box>

        </Box>
        <TabLayout
          value={ value }
          index={ 0 }
          type="pending"
          empId={ debouncedFilter }
        />
        <TabLayout
          value={ value }
          index={ 1 }
          type="approved"
          empId={ debouncedFilter }
        />
        <TabLayout
          value={ value }
          index={ 2 }
          type="rejected"
          empId={ debouncedFilter }
        />
      </Paper>
    </>
  );
}
