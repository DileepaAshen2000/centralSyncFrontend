import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Stack,
  Select,
  Popover,
  MenuList,
} from "@mui/material";
import { useForm } from "react-hook-form";
//import image from "../assests/flyer-Photo.jpg";
import SelectD from "./Select_D";
import SelectR from "./Select_R";
import axios from "axios";
import MenuItem from "@mui/material/MenuItem";
import { Link, useNavigate, useParams } from "react-router-dom";
//import DragDrop from "./Drag&Drop";
//import { DropzoneArea } from 'material-ui-dropzone';
//import Dropzone from "./Dropzone";

const EditUser = () => {
  const [firstName, setfName] = useState("");
  const [lastName, setlName] = useState("");
  const [dateOfBirth, setDOb] = useState("");
  const [mobileNo, setMNumber] = useState("");
  const [telNo, setTelNumber] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("");
  const { ID } = useParams();
  const [isEditable, setIsEditable] = useState(true);
  const [fetchData, setFetchData] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:8080/user/users/` + ID)

      .then((response) => {
        const data = {
          id: response.data.index,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          dateOfBirth: response.data.dateOfBirth,
          mobileNo: response.data.mobileNo,
          telNo: response.data.telNo,
          address: response.data.address,
          email: response.data.email,
          department: response.data.department,
          role: response.data.role,
        };
        setfName(data.firstName);
        setlName(data.lastName);
        setDOb(data.dateOfBirth);
        setMNumber(data.mobileNo);
        setTelNumber(data.telNo);
        setAddress(data.address);
        setEmail(data.email);
        setDepartment(data.department);
        setRole(data.role);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [ID]);

  const handleEdit = () => {
    console.log("Edit button clicked");
    setIsEditable(!isEditable);
    console.log(isEditable);
  };

  const handleSave = (e) => {
    const user = {
      firstName,
      lastName,
      dateOfBirth,
      mobileNo,
      telNo,
      address,
      email,
      department,
      role,
    };

    axios
      .put("http://localhost:8080/user/update/" + ID, user)
      .then(() => {
        console.log("Successfully updated");

        navigate("/user");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleMoreButton = (event) => {
    setAnchorEl(event.currentTarget);
    setIsOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setIsOpen(false);
  };

  const handleDelete = () => {
    try {
      axios.delete("http://localhost:8080/user/delete/" + ID).then(() => {
        setFetchData(!fetchData);
        navigate("/user", { fetchData });
      });
    } catch (error) {
      console.log(error);
    }
  };

  {
    /*const handleMarkAsInactiveButton = () => {
    axios
      .patch(
        "http://localhost:8080/User/updateStatus/" + ID + "/inactive"
      )
      .then(() => {
        setFetchData(!fetchData);
        navigate("/user", { fetchData });
      })
      .catch((error) => {
        console.log(error);
      });
  };*/
  }

  return (
    <>
      <div className="grid grid-cols-4 grid-rows-1 gap-y-7 gap-x-[0.25rem] mb-10 ">
        <div className="col-start-1">
          <h1 className="text-3xl font-bold ">Edit User Details</h1>
        </div>
        <div className="col-start-4">
          <Button
            variant="contained"
            className="bg-[#007EF2] w-[150px] rounded-md text-white border-blue-[#007EF2] hover:text-[#007EF2] hover:bg-white"
            onClick={handleMoreButton}
          >
            More
          </Button>

          <Popover
            open={isOpen}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <MenuList>
              <MenuItem>
                <Button
                  variant="contained"
                  className="bg-[#007EF2] w-[180px] rounded-md text-white border-blue-[#007EF2] hover:text-[#007EF2] hover:bg-white"
                  onClick={handleEdit}
                >
                  Edit
                </Button>
              </MenuItem>
              <MenuItem>
                <Button
                  variant="contained"
                  className="bg-[#007EF2] w-[180px] rounded-md text-white border-blue-[#007EF2] hover:text-[#007EF2] hover:bg-white"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </MenuItem>
              <MenuItem>
                <Button
                  variant="contained"
                  className="bg-[#007EF2] w-[180px] rounded-md text-white border-blue-[#007EF2] hover:text-[#007EF2] hover:bg-white"
                  //onClick={handleMarkAsInactiveButton}
                >
                  Mark as inactive
                </Button>
              </MenuItem>
            </MenuList>
          </Popover>
        </div>
      </div>
      <div>
        <form noValidate>
          <div className="grid grid-cols-6 grid-rows-7  gap-x-[0.25rem] ">
            <div className="col-span-1 row-span-1">
              <label htmlFor="5">Employee Id</label>
            </div>
            <div className="col-span-2">
              <TextField
                name="id"
                placeholder=""
                InputProps={{
                  className:
                    "w-[375px] cursor-auto h-9 border border-[#857A7A] rounded-xl px-2 ",
                  readOnly: true,
                }}
                value={ID}
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
                  className:
                    "w-[375px] cursor-auto h-9 border border-[#857A7A] rounded-xl px-2 ",
                  readOnly: isEditable,
                }}
                value={firstName}
                onChange={(e) => setfName(e.target.value)}
              />
            </div>
            <div className="col-span-3"> </div>
            <div className="col-span-2">
              <TextField
                variant="outlined"
                placeholder="Last Name"
                id="lastName"
                value={lastName}
                onChange={(e) => setlName(e.target.value)}
                InputProps={{
                  className:
                    "w-[375px] cursor-auto h-9 border border-[#857A7A] rounded-xl px-2 ",
                  readOnly: isEditable,
                }}
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
                value={department}
                onChange={(e) => {
                  console.log("Selected Department:", e.target.value);
                  setDepartment(e.target.value);
                }}
                id="department"
                className="w-[375px] cursor-auto h-9 border border-[#857A7A] rounded-xl px-2"
              >
                <MenuItem disabled value={department}></MenuItem>
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
                value={role}
                onChange={(e) => {
                  console.log("Selected Role:", e.target.value);
                  setRole(e.target.value);
                }}
                id="role"
                className="w-[375px] cursor-auto h-9 border border-[#857A7A] rounded-xl px-2"
              >
                <MenuItem disabled value={role}></MenuItem>
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
                  className:
                    "w-[375px] cursor-auto h-9 border border-[#857A7A] rounded-xl px-2 ",
                  readOnly: isEditable,
                }}
                InputLabelProps={{ shrink: true }}
                value={dateOfBirth}
                onChange={(e) => setDOb(e.target.value)}
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
                  className:
                    "w-[375px] cursor-auto h-[65px] border border-[#857A7A] rounded-xl px-2",
                  readOnly: isEditable,
                }}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
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
                  className:
                    "w-[375px] cursor-auto h-[35px] border border-[#857A7A] rounded-xl px-2 ",
                  readOnly: isEditable,
                }}
                value={mobileNo}
                name="mobileNo"
                onChange={(e) => setMNumber(e.target.value)}
              />{" "}
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
                  className:
                    "w-[375px] cursor-auto h-[35px] border border-[#857A7A] rounded-xl px-2 ",
                  readOnly: isEditable,
                }}
                value={telNo}
                name="telNo"
                onChange={(e) => setTelNumber(e.target.value)}
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
                  className:
                    "w-[375px] cursor-auto h-[35px] border border-[#857A7A] rounded-xl px-2",
                  readOnly: isEditable,
                }}
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div></div>
            <div></div>
            <div></div>
          </div>

          <div className="flex items-center">
            <h3 className="pt-10 pb-10 text-[#796F6F]"> User Credentials</h3>
            <hr className="border-[#796F6F] ml-4 flex-grow" />
          </div>

          <div className="grid grid-cols-6 grid-rows-2 gap-y-7 gap-x-[0.25rem] ">
            <div className="col-span-1">
              <label htmlFor="name">Password</label>
            </div>
            <div className="col-span-2">
              <TextField
                type="password"
                id="password"
                placeholder=""
                InputProps={{
                  className:
                    "w-[375px] cursor-auto h-[35px] border border-[#857A7A] rounded-xl px-2 ",
                }}
              />{" "}
            </div>
            <div></div>
            <div></div>
            <div></div>
            <div className="col-span-1">
              <label htmlFor="name">Confirm Password</label>
            </div>
            <div className="col-span-2">
              <TextField
                type="password"
                id="cpassword"
                placeholder=""
                InputProps={{
                  className:
                    "w-[375px] cursor-auto h-[35px] border border-[#857A7A] rounded-xl px-2 ",
                }}
              />
            </div>
            <div></div>
            <div></div>
            <div></div>
          </div>

          <div className="grid grid-cols-6 grid-rows-2 gap-y-7 gap-x-[0.25rem] mt-12 ">
            <div className="col-start-5">
              <Button
                variant="outlined"
                className="bg-[#007EF2] w-[150px] rounded-md text-white border-blue-[#007EF2] hover:text-[#007EF2] hover:bg-white"
                onClick={handleSave}
              >
                Save
              </Button>
            </div>
            <div className="col-start-6">
              <Button
                variant="outlined"
                className="bg-white w-[150px] rounded-md text-[#007EF2] border-blue-[#007EF2] hover:text-white hover:bg-[#007EF2]"
                onClick={() => navigate("/User")}
              >
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};
export default EditUser;
