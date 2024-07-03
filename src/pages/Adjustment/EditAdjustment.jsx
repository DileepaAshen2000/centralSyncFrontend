import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Autocomplete,
  Box,
  MenuItem,
  Select,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const EditTicket = () => {
  const { ID } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [itemId, setItemId] = useState("");
  const [itemName, setItemName] = useState("");
  const [brand, setBrand] = useState("");
  const [errors, setErrors] = useState({});
  const [options, setOptions] = useState([]);
  const [fetchData, setFetchData] = useState(false);

  // Fetch options for the Autocomplete
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get("http://localhost:8080/inventory-item/getAll");
        setOptions(response.data);
        console.log("Options fetched: ", response.data);
      } catch (error) {
        console.error("Error fetching item data:", error);
      }
    };
    fetchOptions();
  }, []);

  // Fetch ticket details
  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/ticket/tickets/${ID}`);
        const { topic, description, date, itemId } = response.data;
        setTopic(topic);
        setDescription(description);
        setDate(date);
        setItemId(itemId);
      } catch (error) {
        console.error("Error fetching ticket details:", error);
      }
    };

    fetchTicketDetails();
  }, [ID]);

  // Update itemName and brand when itemId changes
  useEffect(() => {
    if (itemId) {
      const selectedItem = options.find((option) => option.id === itemId);
      if (selectedItem) {
        setItemName(selectedItem.itemName);
        setBrand(selectedItem.brand);
      }
    }
  }, [itemId, options]);

  // Handle item selection
  const handleItemChange = (event, value) => {
    if (value) {
      console.log("Selected item: ", value);
      setItemId(value.id);
      setItemName(value.itemName);
      setBrand(value.brand);
    } else {
      setItemId("");
      setItemName("");
      setBrand("");
    }
  };

  // Handle form submission
  const handleClick = async (e) => {
    e.preventDefault();
    const ticket = {
      topic,
      description,
      date,
      itemName,
      brand,
      itemId
    };

    try {
      const response = await axios.put(`http://localhost:8080/ticket/update/${ID}`, ticket);
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Ticket successfully updated!",
        });
        setFetchData(!fetchData);
        navigate("/ticket", { fetchData });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to update Ticket. Please check your inputs.",
      });
      if (error.response) {
        setErrors(error.response.data);
      }
    }
  };

  return (
    <>
      <Box className="p-5 bg-white rounded-2xl w-[1122.7px]">
        <Box className="pb-4">
          <h1 className="pt-2 pb-3 text-3xl font-bold ">Edit Ticket</h1>
        </Box>
        <form>
          <div className="grid grid-cols-6 grid-rows-6 gap-x-5 gap-y-5">
            <div className="col-span-1">
              <label htmlFor="name">Item Name</label>
            </div>
            <div className="col-span-2">
              {errors.itemName && (
                <div className="text-[#FC0000] text-sm">{errors.itemName}</div>
              )}
              <Autocomplete
                options={options}
                getOptionLabel={(option) => option?.itemName || ""}
                onChange={handleItemChange}
                value={options.find(option => option.id === itemId) || null}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Item name"
                    variant="outlined"
                    sx={{
                      width: 300,
                    }}
                    size="small"
                  />
                )}
              />
            </div>
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
                getOptionLabel={(option) => option?.brand || ""}
                onChange={handleItemChange}
                value={options.find(option => option.id === itemId) || null}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Brand"
                    variant="outlined"
                    sx={{
                      width: 300,
                    }}
                    size="small"
                  />
                )}
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
                className="w-[300px]"
                onChange={(e) => setTopic(e.target.value)}
                value={topic}
                size="small"
              >
                <MenuItem disabled value="">
                  <em>None</em>
                </MenuItem>
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
                type="date"
                variant="outlined"
                InputProps={{
                  className: "w-[300px]",
                }}
                value={date}
                onChange={(e) => setDate(e.target.value)}
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
                  className: "w-[450px] h-[100px]",
                }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                size="small"
              />
            </div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div className="grid grid-cols-6 grid-rows-2 gap-y-7 gap-x-[0.25rem] mt-12">
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
                onClick={() => navigate("/ticket")}
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

export default EditTicket;
