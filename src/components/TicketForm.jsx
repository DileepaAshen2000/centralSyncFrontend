import React, { useEffect, useState } from "react";
import { TextField, Button, Stack, Select,MenuItem,Autocomplete } from "@mui/material";
import { useForm } from "react-hook-form";
//import image from "../assests/flyer-Photo.jpg";
//import DragDrop from "./Drag&Drop";
//import { DropzoneArea } from 'material-ui-dropzone';
//import Dropzone from "./Dropzone";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
 

const TicketForm= () => {
  const form = useForm();
  const [topic, settopic] = useState("");
  const [description, setdescription] = useState("");
  const [date, setdate] = useState("");
  const [itemName, setItemName] = useState("");
  const [brand, setBrand] = useState("");

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/inventory-item/getAll');
        setOptions(response.data);
      } catch (error) {
        console.error('Error fetching item data:', error);
      }
    };
    fetchData();
  }, []);

  

  console.log('Options:', options);

  const handleItemChange = (event, value) => {
    if (value) {
      setItemName(value.itemName);
    } else {
      setItemName('');
    }
  };

  const handleItembrandChange = (event, value) => {
    if (value) {
      setBrand(value.brand);
    } else {
      setBrand('');
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    const ticket = {
      topic,
      description,
      date,
      itemName,
      brand
        };
    console.log(ticket);
    fetch("http://localhost:8080/ticket/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ticket),
    })
    .then(response => {
      if(response.ok){
        console.log("New ticket added");

      }
      else{
        response.json().then(errors =>{
          setErrors(errors);
        });
      }
    });
  };
    

  return (
    <>
      <form>
        <div className="grid grid-cols-6 grid-rows-6  gap-x-5 gap-y-5">
          <div className="col-span-1">
            <label htmlFor="name">Item Name</label>
            
           
          </div>
          <div className="col-span-2">
          {errors.firstName && <div className="text-[#FC0000] text-sm">{errors.firstName}</div>}
          <Autocomplete
                options={options}
                getOptionLabel={(option) => option.itemName}
                onChange={handleItemChange}
                value={options.find((option) => option.itemName === itemName) || null}
                renderInput={(params) => (
                  <TextField {...params} label="Item Name" variant="outlined" fullWidth />
                )}
              />
           
          </div>{" "}
          <div className="col-span-3">
          

          </div>
          <div className="col-span-1">
            <label htmlFor="name">Item Brand</label>
            
           
          </div>
          <div className="col-span-3">
          {errors.lastName && <div className="text-[#FC0000] text-sm">{errors.lastName}</div>}
            
          <Autocomplete
                options={options}
                getOptionLabel={(option) => option.brand}
                onChange={handleItembrandChange}
                value={options.find((option) => option.brand === brand) || null}
                renderInput={(params) => (
                  <TextField {...params} label="brand" variant="outlined" fullWidth />
                )}
              />
          </div>
          <div></div>
          <div></div>
           
          <div className="col-span-1 row-span-1">
            <label htmlFor="topic">Topic for ticket</label>
          </div>
          <div className="col-span-2">
          {errors.department && <div className="text-[#FC0000] text-sm">{errors.department}</div>}
          <Select
              
              id="topic"
              className="w-[375px] cursor-auto h-9 border border-[#857A7A] rounded-xl px-2"
              onChange={(e) => settopic(e.target.value)}
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
          {errors.role && <div className="text-[#FC0000] text-sm">{errors.role}</div>}
          <TextField
              variant="outlined"
              InputProps={{
                className:
                  "w-[375px] cursor-auto border border-[#857A7A] rounded-xl px-2 h-9 ",
              }}
              value={date}
              onChange={(e) => setdate(e.target.value)}
            />
          </div>
          <div></div>
          <div></div>
          <div></div>
          <div className="col-span-1">
            <label htmlFor="description">Description</label>
          </div>
          <div className="col-span-2 row-span-2">
          {errors.role && <div className="text-[#FC0000] text-sm">{errors.role}</div>}
          <TextField
              variant="outlined"
              InputProps={{
                className:
                  "w-[450px] cursor-auto h-[100px] border border-[#857A7A] rounded-xl px-2 ",
              }}
              value={description}
              onChange={(e) => setdescription(e.target.value)}
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
      
       
    </>
  );
};
export default TicketForm;
