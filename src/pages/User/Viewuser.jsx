import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Stack,
  Select,
  Box,
  CircularProgress,
  Backdrop,
} from "@mui/material";
// import { useForm } from "react-hook-form";
//import image from "../assests/flyer-Photo.jpg";
import axios from "axios";
import MenuItem from "@mui/material/MenuItem";
import { Link, useNavigate, useParams } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Swal from "sweetalert2";
import LoginService from "../Login/LoginService";
//import DragDrop from "./Drag&Drop";
//import { DropzoneArea } from 'material-ui-dropzone';
//import Dropzone from "./Dropzone";

const ViewUser = () => {
  // State for user details
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    mobileNo: "",
    telNo: "",
    address: "",
    email: "",
    department: "",
    role: "",
    workSite: "",
    imagePath: "",
    status: "",
  });
  const [fetchData, setFetchData] = useState(false);
  const { ID } = useParams();
  const [loading, setLoading] = useState(false);
  const isRequestHandler = LoginService.isReqHandler();

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:8080/user/users/${ID}`)
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.log("Error fetching user:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [ID]);

  // Handle marking the item as inactive
  const handleMarkAsInactive = () => {
    axios
      .patch(`http://localhost:8080/user/updateStatus/${ID}`)
      .then((response) => {
        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "User marked as inactive!",
          });
          navigate("/user");
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to update status",
        });
        console.log(error);
      });
  };

  // Handle marking the item as inactive
  const handleMarkAsActive = () => {
    axios
      .patch(`http://localhost:8080/user/updateStatusActive/${ID}`)
      .then((response) => {
        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "User succesfully marked as active!",
          });

          navigate("/user");
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to update status",
        });
        console.log(error);
      });
  };

  return (
    <>
      <Box className="p-5 bg-white rounded-2xl w-[1122.7px]">
        <div className="grid grid-cols-6 grid-rows-1 gap-y-10 gap-x-[0.25rem] mt-12 pb-10">
        
        <h1 className="col-span-4 text-3xl font-bold ">User Details</h1>
      
          {!isRequestHandler && (
            <>
              {user.status === "ACTIVE" && (
                <div className="col-start-6">
                  <Button
                    variant="contained"
                    className="bg-red-600 w-[170px] h-[40px] rounded text-white border-blue-[#007EF2] hover:text-[#007EF2] hover:bg-white"
                    onClick={handleMarkAsInactive}
                  >
                    Mark as Inactive
                  </Button>
                </div>
              )}
              {user.status === "INACTIVE" && (
                <div className="col-start-6">
                  <Button
                    variant="contained"
                    className="bg-green-600 w-[170px] h-[40px] rounded text-white border-blue-[#007EF2] hover:text-[#007EF2] hover:bg-white"
                    onClick={handleMarkAsActive}
                  >
                    Mark as Active
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        <form noValidate>
          <div className="grid grid-cols-6 grid-rows-7  gap-x-[0.25rem] gap-y-7 ">
            <div className="col-span-1 row-span-1">
              <label htmlFor="5">Employee Id</label>
            </div>
            <div className="col-span-2">
              <TextField
                name="id"
                placeholder=""
                InputProps={{
                  className: "w-[300px] ",
                  readOnly: true,
                }}
                value={ID}
                size="small"
              />
            </div>
            <div></div>
            <div className="row-span-4 col-span-2">
              {user.imagePath && (
                <Avatar
                  src={`http://localhost:8080/user/display/${ID}`}
                  alt="Profile"
                  sx={{ width: 220, height: 220 }}
                />
              )}
            </div>
            <div className="col-span-1">
              <label htmlFor="name">Name</label>
            </div>
            <div className="col-span-2">
              <TextField
                id="firstName"
                variant="outlined"
                placeholder="First Name"
                InputProps={{
                  className: "w-[300px] ",
                  readOnly: true,
                }}
                value={user.firstName}
                name="firstName"
                size="small"
              />
            </div>
            <div></div>

            <div className="col-span-1"> </div>
            <div className="col-span-2">
              <TextField
                variant="outlined"
                placeholder="Last Name"
                id="lastName"
                value={user.lastName}
                name="firstName"
                InputProps={{
                  className: "w-[300px] ",
                  readOnly: true,
                }}
                size="small"
              />
            </div>
            <div></div>

            <div className="col-span-1 row-span-1">
              <label htmlFor="2">Department</label>
            </div>
            <div className="col-span-2">
              <TextField
                value={user.department}
                name="department"
                id="department"
                className="w-[300px] "
                size="small"
                InputProps={{
                  readOnly: true,
                }}
              />
            </div>
            <div></div>

            <div className="col-span-1 row-span-1">
              <label htmlFor="3">Role</label>
            </div>
            <div className="col-span-2">
              <TextField
                value={user.role}
                InputProps={{
                  readOnly: true,
                }}
                name="role"
                id="role"
                className="w-[300px]"
                size="small"
              />
            </div>
            <div></div>
            <div></div>
            <div></div>

            <div className="col-span-1 row-span-1">
              <label htmlFor="3">Work Site</label>
            </div>
            <div className="col-span-2">
              <TextField
                value={user.workSite}
                InputProps={{
                  readOnly: true,
                }}
                name="workSite"
                id="workSite"
                className="w-[300px]"
                size="small"
              />
            </div>
            <div></div>
            <div></div>
            <div></div>
            <div className="col-span-1 row-span-1">
              <label htmlFor="4">Date Of Birth</label>
            </div>
            <div className="col-span-2">
              <TextField
                id="date"
                placeholder="dd/mm/yy"
                name="dateOfBirth"
                InputProps={{
                  className: "w-[300px] ",
                  readOnly: true,
                }}
                InputLabelProps={{ shrink: true }}
                value={user.dateOfBirth}
                size="small"
              />
            </div>
            <div></div>
            <div></div>
            <div></div>
            <div className="col-span-1 row-span-1">
              <label htmlFor="5">Adress</label>
            </div>
            <div className="col-span-2">
              <TextField
                type="text"
                id="adress"
                name="address"
                placeholder=""
                InputProps={{
                  className: "w-[300px]",
                  readOnly: true,
                }}
                value={user.address}
                size="small"
              />
            </div>
            <div></div>
            <div></div>
            <div></div>
          </div>

          <div className="flex items-center">
            <h3 className="pt-10 pb-10 text-[#796F6F]"> User Contact Info</h3>
            <hr className="border-[#796F6F] ml-4 flex-grow" />
          </div>

          <div className="grid grid-cols-6 grid-rows-2 gap-y-7 gap-x-[0.25rem] ">
            <div className="col-span-1">
              <label htmlFor="name">Mobile No </label>
            </div>
            <div className="col-span-2">
              <TextField
                type="text"
                id="mno"
                placeholder=""
                InputProps={{
                  className: "w-[300px] ",
                  readOnly: true,
                }}
                value={user.mobileNo}
                name="mobileNo"
                size="small"
              />
            </div>
            <div className="col-span-1">
              <label htmlFor="name" className="pl-20">
                Tel No
              </label>
            </div>
            <div className="col-span-2">
              <TextField
                type="text"
                id="Tno"
                placeholder=""
                InputProps={{
                  className: "w-[300px] ",
                  readOnly: true,
                }}
                name="telNo"
                value={user.telNo}
                size="small"
              />
            </div>
            <div className="col-span-1">
              <label htmlFor="name">Email Adress</label>
            </div>
            <div className="col-span-2">
              <TextField
                type="text"
                id="email"
                placeholder=""
                InputProps={{
                  className: "w-[300px]",
                  readOnly: true,
                }}
                name="email"
                value={user.email}
                size="small"
              />
            </div>
            <div></div>
            <div></div>
            <div></div>
          </div>

          <div className="grid grid-cols-6 grid-rows-2 gap-y-7 gap-x-[0.25rem] mt-12 ">
            <div className="col-start-6">
              <Button
                variant="outlined"
                className="bg-white w-[150px] rounded text-[#007EF2] border-blue-[#007EF2] hover:text-white hover:bg-blue-600"
                onClick={() => navigate("/user")}
              >
                Cancel
              </Button>
            </div>
          </div>
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </form>
      </Box>
    </>
  );
};
export default ViewUser;
