import React, { useEffect, useState } from "react";
import { TextField, Button, Stack, Select, Box } from "@mui/material";
// import { useForm } from "react-hook-form";
//import image from "../assests/flyer-Photo.jpg";
import axios from "axios";
import MenuItem from "@mui/material/MenuItem";
import { Link, useNavigate, useParams } from "react-router-dom";
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
  });
  const [fetchData, setFetchData] = useState(false);
  const { ID } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user details by ID on component mount
    axios
      .get(`http://localhost:8080/user/users/${ID}`)
      .then((response) => {
        // Update user state with fetched data
        setUser(response.data);
      })
      .catch((error) => {
        console.log("Error fetching user:", error);
      });
  }, [ID]);

  const handleDelete = () => {
    try {
      axios.delete(`http://localhost:8080/user/delete/${ID}`).then(() => {
        setFetchData(!fetchData);
        navigate("/user", { fetchData });
      });
    } catch (error) {
      console.log(error);
    }
  };

    // Handle marking the item as inactive
    const handleMarkAsInactive = () => {
      axios
        .patch(`http://localhost:8080/user/updateStatus/${ID}`)
        .then(() => {
  
          navigate("/user");
        })
        .catch((error) => {
          console.log(error);
        });
    };
  

  return (
    <>
      <Box className="p-5 bg-white rounded-2xl w-[1122.7px]">

        <div className="grid grid-cols-6 grid-rows-1 gap-y-10 gap-x-[0.25rem] mt-12 pb-10" >
        <div className="col-start-1 col-span-2">
        <h1 className="pt-2 pb-3 text-3xl font-bold ">User Details</h1>
        
        </div>
            

            <div className="col-start-6">
              <Button
                variant="contained"
                className="bg-blue-600 w-[170px] h-[40px] rounded text-white border-blue-[#007EF2] hover:text-[#007EF2] hover:bg-white"
                onClick={handleMarkAsInactive}
              >
                Mark as Inactive
              </Button>
            </div>
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
            <div></div>
            <div></div>
            <div className="col-span-1 row-span-2">
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
            <div className="col-span-3"> </div>
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
            <div></div>
            <div></div>
            <div className="col-span-1 row-span-1">
              <label htmlFor="2">Department</label>
            </div>
            <div className="col-span-2">
              <Select
                value={user.department}
                name="department"
                id="department"
                className="w-[300px] "
                size="small"
                InputProps={{
                  readOnly: true,
                }}
              >
                <MenuItem disabled value={user.department}></MenuItem>
                <MenuItem value="Programming">Programming</MenuItem>
                <MenuItem value="Cybersecurity">Cybersecurity</MenuItem>
              </Select>
            </div>
            <div></div>
            <div></div>
            <div></div>
            <div className="col-span-1 row-span-1">
              <label htmlFor="3">Role</label>
            </div>
            <div className="col-span-2">
              <Select
                value={user.role}
                InputProps={{
                  readOnly: true,
                }}
                name="role"
                className="w-[300px]"
                size="small"
              >
                <MenuItem disabled value={user.role}></MenuItem>
                <MenuItem value="Web Developer">Web Developer</MenuItem>
                <MenuItem value="Software Architect">
                  Software Architect
                </MenuItem>
              </Select>
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
            <div className="col-start-5">
              <Button
                variant="contained"
                className="bg-blue-600 w-[150px] rounded text-white border-blue-[#007EF2] hover:text-[#007EF2] hover:bg-white"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
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
        </form>
      </Box>
    </>
  );
};
export default ViewUser;
