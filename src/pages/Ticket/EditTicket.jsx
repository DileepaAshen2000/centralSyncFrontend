import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Stack,
  Select,
  MenuItem,
  Autocomplete,
  Box,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const EditTicket = () => {
  const { id } = useParams();
  const form = useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState({
    topic: "",
    description: "",
    date: "",
    itemId: { itemName: "", brand: "", model: "" },
  });
  const [errors, setErrors] = useState({});
  const [options, setOptions] = useState([]);
  const [itemNameOptions, setItemNameOptions] = useState([]);
  const [brandOptions, setBrandOptions] = useState([]);
  const [modelOptions, setModelOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredBrandOptions, setFilteredBrandOptions] = useState([]);
  const [filteredModelOptions, setFilteredModelOptions] = useState([]);

  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8080/ticket/tickets/${id}`
        );
        const { topic, description, date, itemId } = response.data;
        const itemResponse = await axios.get(
          `http://localhost:8080/inventory-item/getById/${itemId.itemId}`
        );
        const { itemName, brand, model } = itemResponse.data;

        setTicket({
          topic,
          description,
          date,
          itemId,
          itemName,
          brand,
          model,
        });
      } catch (error) {
        console.error("Error fetching ticket data:", error);
      }
      finally{
        setLoading(false);
      };
    };

    const fetchItemData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/inventory-item/getAll"
        );
        const uniqueItemNames = [
          ...new Set(response.data.map((item) => item.itemName)),
        ];
        const uniqueBrands = [
          ...new Set(response.data.map((item) => item.brand)),
        ];
        const uniqueModels = [
          ...new Set(response.data.map((item) => item.model)),
        ];

        setOptions(response.data);
        setItemNameOptions(uniqueItemNames);
        setBrandOptions(uniqueBrands);
        setModelOptions(uniqueModels);
      } catch (error) {
        console.error("Error fetching item data:", error);
      }
    };

    fetchTicketData();
    fetchItemData();
  }, [id]);

  const handleItemChange = (event, value) => {
    if (value) {
      setTicket((prevTicket) => ({
        ...prevTicket,
        itemName: value,
        brand: "", // Reset brand and model when item changes
        model: "",
      }));

      // Update brand and model options based on the selected item
      const filteredBrands = options
        .filter((option) => option.itemName === value)
        .map((option) => option.brand);
      setFilteredBrandOptions([...new Set(filteredBrands)]);
  
      setFilteredModelOptions([]);
    } else {
      setTicket((prevTicket) => ({
        ...prevTicket,
        itemName: "",
        brand: "",
        model: "",
      }));
      setFilteredBrandOptions([]);
      setFilteredModelOptions([]);
    }
  };
  
  const handleItembrandChange = (event, value) => {
    if (value) {
      setTicket((prevTicket) => ({
        ...prevTicket,
        brand: value,
        model: "", // Reset model when brand changes
      }));
  
      // Update model options based on the selected brand and item
      const filteredModels = options
        .filter(
          (option) =>
            option.itemName === ticket.itemName && option.brand === value
        )
        .map((option) => option.model);
      setFilteredModelOptions([...new Set(filteredModels)]);
    } else {
      setTicket((prevTicket) => ({
        ...prevTicket,
        brand: "",
        model: "",
      }));
      setFilteredModelOptions([]);
    }
  };
  
  const handleItemmodelChange = (event, value) => {
    if (value) {
      setTicket((prevTicket) => ({
        ...prevTicket,
        model: value,
      }));
    } else {
      setTicket((prevTicket) => ({
        ...prevTicket,
        model: "",
      }));
    }
  };


  const validateField = (name, value) => {
    const validationErrors = {};

    if (name === "itemName" && !value) {
      validationErrors.itemName = "Item name is required";
    } else if (name === "brand" && !value) {
      validationErrors.brand = "Item brand is required";
    } else if (name === "model" && !value) {
      validationErrors.model = "Item model is required";
    } else if (name === "topic" && !value) {
      validationErrors.topic = "Topic is required";
    } else if (name === "date" && !value) {
      validationErrors.date = "Date is required";
    } else if (name === "description") {
      if (!value) {
        validationErrors.description = "Description is required";
      } else if (value.length < 10 || value.length > 200) {
        validationErrors.description =
          "Description must be between 10 and 200 characters";
      }
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validationErrors[name],
    }));

    // Remove the error if there is no validation error for the field
    if (!validationErrors[name]) {
      setErrors((prevErrors) => {
        const { [name]: removedError, ...rest } = prevErrors;
        return rest;
      });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleClick = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:8080/ticket/update/${id}`, ticket)
      .then((response) => {
        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Ticket successfully updated!",
          });
          navigate("/ticket");
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to update Ticket. Please check your inputs.",
        });
        const backendErrors = error.response.data;
        setErrors(backendErrors);
      });
  };

  return (
    <>
      <Box className="p-5 bg-white rounded-2xl w-[1122.7px]">
      <div className="pb-12">
        <Box className="w-[1100.7px]  bg-blue-900 text-white text-center p-3">
          <header className="text-3xl font-bold">Edit Ticket</header>
        </Box>
      </div>
        <form>
          <div className="grid grid-cols-7 grid-rows-7 gap-x-5 gap-y-5">
            <div className="col-span-1">
              <label htmlFor="name">Item Name</label>
            </div>
            <div className="col-span-2">
              {errors.itemName && (
                <div className="text-[#FC0000] text-sm">{errors.itemName}</div>
              )}
               
              <Autocomplete
                options={itemNameOptions}
                getOptionLabel={(option) => option}
                onChange={handleItemChange}
                value={ticket.itemName || null}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    size="small"
                    error={!!errors.itemName}
                    sx={{
                      width: 300,
                    }}
                     
                  />
                )}
              />
            </div>{" "}
            <div className="col-span-4"></div>
            <div className="col-span-1">
              <label htmlFor="name">Item Brand</label>
            </div>
            <div className="col-span-3">
              {errors.brand && (
                <div className="text-[#FC0000] text-sm">{errors.brand}</div>
              )}

              <Autocomplete
                options={filteredBrandOptions}
                getOptionLabel={(option) => option}
                onChange={handleItembrandChange}
                value={ticket.brand || null}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Brand"
                    variant="outlined"
                    size="small"
                    error={!!errors.brand}
                    sx={{
                      width: 300,
                    }}
                     
                  />
                )}
              />
            </div>
            <div></div>
            <div></div>
            <div></div>
            <div className="col-span-1">
              <label htmlFor="name">Item Model</label>
            </div>
            <div className="col-span-3">
              {errors.model && (
                <div className="text-[#FC0000] text-sm">{errors.model}</div>
              )}

              <Autocomplete
                options={filteredModelOptions}
                getOptionLabel={(option) => option}
                onChange={handleItemmodelChange}
                value={ticket.model || null}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Model"
                    variant="outlined"
                    size="small"
                    error={!!errors.model}
                    sx={{
                      width: 300,
                    }}
                     
                  />
                )}
              />
            </div>{" "}
            <div className="col-span-3"></div>
            <div className="col-span-1 row-span-1">
              <label htmlFor="topic">Topic for ticket</label>
            </div>
            <div className="col-span-2">
              {errors.topic && (
                <div className="text-[#FC0000] text-sm">{errors.topic}</div>
              )}
              <Select
                className=" w-[300px] "
                onChange={(e) => {
                  setTicket({ ...ticket, topic: e.target.value });
                  validateField("topic", e.target.value);
                }}
                value={ticket.topic}
                size="small"
                onBlur={handleBlur}
                error={!!errors.topic}
                name="topic"
              >
                <MenuItem disabled value={ticket.topic}></MenuItem>
                <MenuItem value="Network Issues">Network Issues</MenuItem>
                <MenuItem value="Hardware Issues">Hardware Issues</MenuItem>
                <MenuItem value="Software Issues">Software Issues</MenuItem>
                <MenuItem value="Security Issues">Security Issues</MenuItem>
                <MenuItem value="Delivery Issues">Delivery Issues</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </div>
            <div></div>
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
                  className: " w-[300px] ",
                }}
                value={ticket.date}
                onChange={(e) => {
                  setTicket({ ...ticket, date: e.target.value });
                  validateField("date", e.target.value);
                }}
                size="small"
                onBlur={handleBlur}
                error={!!errors.date}
                name="date"
              />
            </div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div className="col-span-1">
              <label htmlFor="description">Description</label>
            </div>
            <div className="col-span-2 row-span-2">
              {errors.description && (
                <div className="text-[#FC0000] text-sm">
                  {errors.description}
                </div>
              )}
              <TextField
                variant="outlined"
                InputProps={{
                  className: "w-[450px] h-[100px]",
                }}
                value={ticket.description}
                onChange={(e) => {
                  setTicket({ ...ticket, description: e.target.value });
                  validateField("description", e.target.value);
                }}
                size="small"
                onBlur={handleBlur}
                error={!!errors.description}
                name="description"
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
                onClick={() => navigate("/ticket")}
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

export default EditTicket;
