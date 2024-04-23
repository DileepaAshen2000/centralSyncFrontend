import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Stack,
  Select,
  MenuItem,
  Autocomplete,
  Box
} from "@mui/material";
import { useForm } from "react-hook-form";
//import image from "../assests/flyer-Photo.jpg";
//import DragDrop from "./Drag&Drop";
//import { DropzoneArea } from 'material-ui-dropzone';
//import Dropzone from "./Dropzone";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
 

const CreateTicket= () => {
  const form = useForm();
  const [topic, settopic] = useState("");
  const [description, setdescription] = useState("");
  const [date, setdate] = useState("");
  const [itemName, setItemName] = useState("");
  const [brand, setBrand] = useState("");
  const [fetchData, setFetchData] = useState(false);

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/inventory-item/getAll"
        );
        setOptions(response.data);
      } catch (error) {
        console.error("Error fetching item data:", error);
      }
    };
    fetchData();
  }, []);

  console.log("Options:", options);

  //function for respond changes in the selected item in item name
  const handleItemChange = (event, value) => {
    if (value) {
      setItemName(value.itemName);
    } else {
      setItemName("");
    }
  };

  //function for respond changes in the selected item in item brand
  const handleItembrandChange = (event, value) => {
    if (value) {
      setBrand(value.brand);
    } else {
      setBrand("");
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    const ticket = {
      topic,
      description,
      date,
      itemName,
      brand,
    };
    console.log(ticket);
    axios
    .post("http://localhost:8080/ticket/add", ticket)
    .then((response) => {
      if (response.status===200) {
        Swal.fire({
          icon:'success',
          title:'Success!',
          text:'Ticket successfully created!'
        });
        setFetchData(!fetchData);   
        navigate("/ticket", { fetchData });
      }
    })
    .catch((error) => {
      Swal.fire({
        icon:'error',
        title:'Error!',
        text:'Failed to add new Ticket. Please check your inputs.'
      }); 
      if (error.response) {
        setErrors(error.response.data);
      }
    });
};
  

  return (
    <>
     <Box className='p-5 bg-white rounded-2xl w-[1122.7px]'>
      <Box className="pb-4">
        <h1 className="pt-2 pb-3 text-3xl font-bold ">New Ticket</h1>
      </Box>
      <form>
        <div className="grid grid-cols-6 grid-rows-6  gap-x-5 gap-y-5">
          <div className="col-span-1">
            <label htmlFor="name">Item Name</label>
          </div>
          <div className="col-span-2">
            {errors.itemName && (
              <div className="text-[#FC0000] text-sm">{errors.itemName}</div>
            )}
            <Autocomplete
              options={options}
              getOptionLabel={(option) => option.itemName}
              onChange={handleItemChange}
              value={
                options.find((option) => option.itemName === itemName) || null
              } //setting initial seleted value
              renderInput={(params) => (
                <TextField
          {...params}
          label="Item name"
          variant="outlined"
          sx={{
             
           width: 300,
         
          }}
          size="small"
        
           
         
        />  //define input field apperance
              )}
            />
          </div>{" "}
          <div className="col-span-3"></div>
          <div className="col-span-1">
            <label htmlFor="name">Item Brand</label>
          </div>
          <div className="col-span-3">
            {errors.brand && (
              <div className="text-[#FC0000] text-sm">{errors.brand}</div>
            )}

            <Autocomplete
              options={options}
              getOptionLabel={(option) => option.brand}
              onChange={handleItembrandChange}
              value={options.find((option) => option.brand === brand) || null}
              variant="outlined"
             
              renderInput={(params) => (
                <TextField
          {...params}
          label="Brand"
          variant="outlined"
          sx={{
           
              
            
           width: 300,
         
          }}
          size="small"
        
           
         
        />  )}
       
  
            
            />
          </div>
          <div></div>
          <div></div>
          <div className="col-span-1 row-span-1">
            <label htmlFor="topic">Topic for ticket</label>
          </div>
          <div className="col-span-2">
            {errors.topic && (
              <div className="text-[#FC0000] text-sm">{errors.topic}</div>
            )}
            <Select
              id="topic"
              className=" w-[300px] "
              onChange={(e) => settopic(e.target.value)}
              size="small"
            >
              <MenuItem disabled value={topic}></MenuItem>
              <MenuItem value="Network Issues">Network Issues</MenuItem>
              <MenuItem value="Hardware Problems">Hardware Problems</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </div>
          <div></div>
          <div></div>
          <div></div>
          <div className="col-span-1 row-span-1">
            <label htmlFor="description">Date</label>
          </div>
          <div className="col-span-2">
            {errors.date && (
              <div className="text-[#FC0000] text-sm">{errors.date}</div>
            )}
            <TextField
              variant="outlined"
              InputProps={{
                className:
                  " w-[300px] ",
              }}
              value={date}
              onChange={(e) => setdate(e.target.value)}
              size="small"
            />
          </div>
          <div></div>
          <div></div>
          <div></div>
          <div className="col-span-1">
            <label htmlFor="description">Description</label>
          </div>
          <div className="col-span-2 row-span-2">
            {errors.description && (
              <div className="text-[#FC0000] text-sm">{errors.description}</div>
            )}
            <TextField
              variant="outlined"
              InputProps={{
                className:
                  "w-[450px] h-[100px]",
              }}
              value={description}
              onChange={(e) => setdescription(e.target.value)}
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
              variant="outlined"
              className="bg-[#007EF2] w-[150px] rounded-md text-white border-blue-[#007EF2] hover:text-[#007EF2] hover:bg-white"
              onClick={handleClick}
            >
              Save
            </Button>
          </div>
          <div className="col-start-6">
            <Button
              variant="outlined"
              className="bg-white w-[150px] rounded-md text-[#007EF2] border-blue-[#007EF2] hover:text-white hover:bg-[#007EF2]"
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
export default CreateTicket;
