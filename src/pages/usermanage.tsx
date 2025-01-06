import React, { useEffect, useState } from "react";

import axios from "axios";
import { styled } from "@mui/material/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  TablePagination,
  Box,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  IconButton,
} from "@mui/material";
import { MenuItem as MuiMenuItem } from "@mui/material";

import { toast, Toaster } from "react-hot-toast";
import { SelectChangeEvent } from "@mui/material/Select";
import { Logout } from "@mui/icons-material"; // Import Material-UI icons
import { useNavigate } from "react-router-dom";

const UserManage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState(""); // State for the search term
  const [selectedFilter, setSelectedFilter] = useState(""); // State for the selected filter
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [bAccess, setSelectedOption] = useState("");
  const [isLoading, setIsLoading] = useState(true); // State for loading
  const [open, setOpen] = useState<boolean>(false);
  const [userLoginName, setName] = useState<string>("");
  const navigate = useNavigate();

  const Dropdown = styled(FormControl)(({ theme }) => ({
    minWidth: "150px",
    [theme.breakpoints.down("md")]: {
      marginTop: "10px",
      width: "100%",
    },
  }));
  const Navbar = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    marginBottom: "20px",
    backgroundColor: "#fff",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      alignItems: "flex-start",
    },
  }));

  const UserIcon = styled(IconButton)(() => ({
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#3f51b5",
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "20px",
    marginLeft: "10px",
    "&:hover": {
      backgroundColor: "#303f9f",
    },
  }));

  useEffect(() => {
    // Retrieve name from localStorage on component mount
    const storedName = localStorage.getItem("name");
    if (storedName) {
      setName(storedName);
    }
  }, []);

  const handleNavigate = async () => {
    function getCookie(name: string) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        return parts.pop()?.split(";").shift();
      }
      return null;
    }

    const token = getCookie("_auth");
    if (!token) {
      console.error("No auth token found");
      return;
    }

    try {
      const response = await axios.post(
        "https://hrms.skillmissionassam.org/nw/Dashboard/get/employeeGroup",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Fetch all users on component mount
          },
        }
      );

      if (response.data.status === false) {
        console.log(response.data.status);
        toast.error("Access Denied, Contact System Admin");
        return;
      } else if (response.data.status === "success") {
        console.log("rfsdsadf", response.data.status);
        navigate("/");
      }
    } catch (error) {
      // Use AxiosError to access the `response` property
      console.log(error);
    }

    // Navigate to the applicant page if successful
  };
  // Fetch user data using the token and searchParams
  const fetchData = async (searchParams = {}) => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("_auth="))
      ?.split("=")[1]; // Extract token from cookies

    try {
      const response = await axios.post(
        "https://hrms.skillmissionassam.org/nw/Authenticate/access/getAll",
        searchParams,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(response.data.data || []); // Set the fetched data to users state, ensure it's an array
      setIsLoading(false); // Set loading to false once data is fetched
    } catch (err) {
      if (err instanceof Error) {
        // setError(err.message);
        // console.error('Error fetching data:', err.message);
      } else {
        setError("An unknown error occurred");
      }
      setIsLoading(false); // Set loading to false even on error
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchData();
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  // Handle search button click
  const handleSearch = () => {
    const searchParams: any = {};
    if (searchTerm !== "" && selectedFilter) {
      switch (selectedFilter) {
        case "loginName":
          searchParams.loginName = searchTerm;
          break;
        case "roleId":
          if (/^\d+$/.test(searchTerm)) {
            searchParams.roleId = searchTerm;
          } else {
            setError("Invalid Role ID");
            return;
          }
          break;
        default:
          console.error("Invalid selection");
          return;
      }
    }
    if (bAccess) {
      searchParams.bAccess = bAccess;
    }

    fetchData(searchParams); // Fetch data with search params
  };

  const handleAccessChange = async (loginId: any, accessValue: any) => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("_auth="))
      ?.split("=")[1]; // Extract token from cookies

    try {
      const response = await axios.post(
        "https://hrms.skillmissionassam.org/nw/Authenticate/access/update",
        {
          loginId: loginId,
          bAccess: accessValue, // 0 for Read, 1 for Read & Write, 2 for No Access
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === true) {
        console.log("Access updated successfully");
        toast.success("Access updated successfully !");

        // Instead of reloading the page, you can re-fetch data or update state
        fetchData();

        // If you still want to reload the page:

        // setTimeout(() => {
        //   window.location.reload();
        // }, 1000);
        // Optional: Adding a delay before reload
      } else {
        console.error("Failed to update access");
        toast.error("Failed to update access !");
      }
    } catch (error) {
      console.error("Error updating access:", error);
      toast.error("Failed to update access !");
    }
  };

  const handleProfileClick = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    // Remove data from localStorage
    // localStorage.removeItem('authToken');  // Remove authToken if it was used
    localStorage.removeItem("name"); // Remove user name

    // Helper function to remove a cookie by its name
    const deleteCookie = (name: string) => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    };

    // Remove data from cookies
    deleteCookie("_auth");
    deleteCookie("_auth_state");
    deleteCookie("_auth_storage");
    deleteCookie("_auth_type");

    // Clear name from state
    setName("");

    // Navigate to the home or login page after logging out
    navigate("/login");
  };

  // Handle Access Dropdown change
  const handleAccessDropdownChange = (e: any) => {
    setSelectedOption(e.target.value);
  };

  // Handle filter change
  const handleFilterChange = (event: SelectChangeEvent<string>) => {
    setSelectedFilter(event.target.value as string);
    setSearchTerm(""); // Clear search input when filter changes
  };

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Handle page change
  const handleChangePage = (_event: unknown, newPage: number) => {
    setCurrentPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0); // Reset page to 0 when changing rows per page
  };

  // Calculate the users to be displayed on the current page
  const paginatedUsers = users.slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage
  );

  return (
    <div style={{ padding: "20px" }}>
      <Toaster />
      <Navbar>
        <Typography variant="h6">
          User Access Management For HR Dashboard
        </Typography>
        <Box display="flex" alignItems="center">
          <Typography variant="body1" style={{ marginRight: "10px" }}>
            {userLoginName} {/* Display login name */}
          </Typography>
          <UserIcon onClick={handleProfileClick}>
            {userLoginName.charAt(0)} {/* Display first letter of login name */}
          </UserIcon>
          {open && (
            <div
              style={{
                position: "absolute",
                marginTop: "90px",
                backgroundColor: "#fff",
                marginLeft: "90px",
              }}
            >
              <MuiMenuItem onClick={handleLogout}>
                <Logout />
                Log Out
              </MuiMenuItem>
            </div>
          )}
        </Box>
      </Navbar>

      <Box display="flex" flexDirection="column" mb={2}>
        {/* Filter and Search Input */}
        <Box display="flex" justifyContent="flex-start" mb={2}>
          <FormControl
            variant="outlined"
            style={{ width: "200px", marginRight: "20px" }}
          >
            <InputLabel id="filter-label">Select Filter</InputLabel>
            <Select
              labelId="filter-label"
              id="filter-select"
              value={selectedFilter}
              onChange={handleFilterChange}
              label="Select Filter"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="loginName">Login Name</MenuItem>
              <MenuItem value="roleId">Role ID</MenuItem>
            </Select>
          </FormControl>

          {selectedFilter && (
            <TextField
              label={`Search by ${
                selectedFilter === "loginName" ? "Login Name" : "Role ID"
              }`}
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              style={{ width: "300px" }}
            />
          )}

          <Dropdown variant="outlined">
            <InputLabel id="access-select-label">Filter by Access</InputLabel>
            <Select
              sx={{ minWidth: 200 }}
              labelId="access-select-label"
              id="access-select"
              value={bAccess}
              label="Filter by Access"
              onChange={handleAccessDropdownChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="read">Read</MenuItem>
              <MenuItem value="write">Read & Write</MenuItem>
              <MenuItem value="none">No Access</MenuItem>
            </Select>
          </Dropdown>

          {/* Trigger Search on Button Click */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch} // Call handleSearch on click
            style={{
              marginLeft: "20px",
              width: "130px",
              height: "45px",
              marginTop: "5px",
            }}
          >
            Search
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleNavigate}
            style={{
              marginLeft: "20px",
              width: "130px",
              height: "45px",
              marginTop: "5px",
            }}
          >
            Dashboard
          </Button>
        </Box>
      </Box>

      {/* Display any error messages */}
      {error && (
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      )}

      {/* Loading Spinner */}
      {isLoading && <Typography>Loading...</Typography>}

      {/* User Table */}
      {!isLoading && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead style={{ backgroundColor: "DodgerBlue" }}>
              <TableRow>
                <TableCell style={{ textAlign: "center" }}>SI No</TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  Login Name
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>Status</TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  Updated By
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  Updated Date
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user, index) => (
                  <TableRow key={user.loginId}>
                    {/* Display Serial Number */}
                    <TableCell style={{ textAlign: "center" }}>
                      {currentPage * rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell style={{ textAlign: "center" }}>
                      {user.loginName}
                    </TableCell>
                    <TableCell style={{ textAlign: "center" }}>
                      {user.Access === 0 ? (
                        <Typography color="primary">Read</Typography>
                      ) : user.Access === 1 ? (
                        <Typography color="secondary">Read/Write</Typography>
                      ) : (
                        <Typography color="inherit">No Access</Typography>
                      )}
                    </TableCell>

                    <TableCell style={{ textAlign: "center" }}>
                      {user.updatedBy}
                    </TableCell>
                    <TableCell style={{ textAlign: "center" }}>
                      {user.updatedDate}
                    </TableCell>
                    <TableCell style={{ textAlign: "center" }}>
                      <Button
                        variant="contained"
                        color="primary"
                        style={{ width: "115px" }}
                        onClick={() => handleAccessChange(user.loginId, 0)}
                      >
                        Read
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        style={{ width: "115px", marginLeft: "10px" }}
                        onClick={() => handleAccessChange(user.loginId, 1)}
                      >
                        Write
                      </Button>
                      <Button
                        variant="contained"
                        color="inherit"
                        style={{ width: "115px", marginLeft: "10px" }}
                        onClick={() =>
                          handleAccessChange(user.loginId, "noAccess")
                        }
                      >
                        No Access
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No Data Available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Pagination Controls


      {/* Pagination Controls */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={2}
      >
        <TablePagination
          component="div"
          count={users.length}
          page={currentPage}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 15]}
        />
      </Box>
    </div>
  );
};

export default UserManage;
