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
//import image from "../assests/flyer-Photo.jpg";
//import DragDrop from "./Drag&Drop";
//import { DropzoneArea } from 'material-ui-dropzone';
//import Dropzone from "./Dropzone";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const CreateTicket = () => {
  const form = useForm();
  const location = useLocation();
  const [topic, settopic] = useState("");
  const [description, setdescription] = useState("");
  const [date, setdate] = useState(new Date().toISOString().split("T")[0]);
  const [itemName, setItemName] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [fetchData, setFetchData] = useState(false);

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [options, setOptions] = useState([]);
  const [itemNameOptions, setItemNameOptions] = useState([]);
  const [brandOptions, setBrandOptions] = useState([]);
  const [modelOptions, setModelOptions] = useState([]);
  const [filteredBrandOptions, setFilteredBrandOptions] = useState([]);
  const [filteredModelOptions, setFilteredModelOptions] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
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

        const brandOptions = uniqueBrands.map((brand) => ({ brand }));
        const itemNameOptions = uniqueItemNames.map((itemName) => ({
          itemName,
        }));
        const modelOptions = uniqueModels.map((model) => ({ model }));

        setOptions(response.data);
        setItemNameOptions(itemNameOptions);
        setBrandOptions(brandOptions);
        setModelOptions(modelOptions);
      } catch (error) {
        console.error("Error fetching item data:", error);
      }
    };
    fetchData();
  }, []);

  console.log("Options:", options);
  useEffect(() => {
    if (location.state?.item) {
      const { itemName, brand, model } = location.state.item;
      setItemName(itemName);
      setBrand(brand);
      setModel(model);
    }
  }, [location.state]);

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

  const handleItemChange = (event, value) => {
    if (value) {
      setItemName(value.itemName);
      validateField("itemName", value.itemName);
      const filteredBrands = options
        .filter((option) => option.itemName === value.itemName)
        .map((option) => option.brand);
      setFilteredBrandOptions([...new Set(filteredBrands)]);
      setBrand("");
      setFilteredModelOptions([]);
    } else {
      setItemName("");
      validateField("itemName", "");
      setFilteredBrandOptions([]);
      setFilteredModelOptions([]);
    }
  };

  const handleItembrandChange = (event, value) => {
    if (value) {
      setBrand(value.brand);
      validateField("brand", value.brand);
      const filteredModels = options
        .filter(
          (option) =>
            option.itemName === itemName && option.brand === value.brand
        )
        .map((option) => option.model);
      setFilteredModelOptions([...new Set(filteredModels)]);
      setModel("");
    } else {
      setBrand("");
      validateField("brand", "");
      setFilteredModelOptions([]);
    }
  };

  const handleItemmodelChange = (event, value) => {
    if (value) {
      setModel(value.model);
      validateField("model", value.model);
    } else {
      setModel("");
      validateField("model", "");
    }
  };

  const findOptionByLabel = (options, label, key) => {
    return options.find((option) => option[key] === label) || null;
  };

  const handleClick = (e) => {
    e.preventDefault();
    const ticket = {
      topic,
      description,
      date,
      itemName,
      brand,
      model,
    };
    console.log(ticket);
    axios
      .post("http://localhost:8080/ticket/add", ticket)
      .then((response) => {
        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Ticket successfully created!",
          });
          setFetchData(!fetchData);
          navigate("/ticket", { fetchData });
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to add new Ticket. Please check your inputs.",
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
          <header className="text-3xl font-bold">New Ticket</header>
        </Box>
      </div>
        <form>
          <div className="grid grid-cols-6 grid-rows-7  gap-x-5 gap-y-5">
            <div className="col-span-1">
              <label htmlFor="name">Item Name</label>
            </div>
            <div className="col-span-2">
              {errors.itemName && (
                <div className="text-[#FC0000] text-sm">{errors.itemName}</div>
              )}
              <Autocomplete
                options={itemNameOptions}
                getOptionLabel={(option) => option.itemName}
                onChange={handleItemChange}
                value={
                  itemNameOptions.find(
                    (option) => option.itemName === itemName
                  ) || null
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Item name"
                    variant="outlined"
                    sx={{
                      width: 300,
                    }}
                    size="small"
                    onBlur={handleBlur}
                    error={!!errors.itemName}
                    name="itemName"
                  />
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
                options={filteredBrandOptions.map((brand) => ({ brand }))}
                getOptionLabel={(option) => option.brand}
                onChange={handleItembrandChange}
                value={brand ? { brand } : null}
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
                    onBlur={handleBlur}
                    error={!!errors.brand}
                    name="brand"
                  />
                )}
              />
            </div>
            <div></div>
            <div></div>
            <div className="col-span-1">
              <label htmlFor="name">Item Model</label>
            </div>
            <div className="col-span-2">
              {errors.model && (
                <div className="text-[#FC0000] text-sm">{errors.model}</div>
              )}
              <Autocomplete
                options={filteredModelOptions.map((model) => ({ model }))}
                getOptionLabel={(option) => option.model}
                onChange={handleItemmodelChange}
                value={model ? { model } : null}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Item model"
                    variant="outlined"
                    sx={{
                      width: 300,
                    }}
                    size="small"
                    onBlur={handleBlur}
                    error={!!errors.model}
                    name="model"
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
                name="topic"
                className=" w-[300px] "
                onChange={(e) => {
                  settopic(e.target.value);
                  validateField("topic", e.target.value);
                }}
                size="small"
                onBlur={handleBlur}
                error={!!errors.topic}
                value={topic}
              >
                <MenuItem disabled value={topic}></MenuItem>
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
            <div className="col-span-1 row-span-1">
              <label htmlFor="date">Date</label>
            </div>
            <div className="col-span-2">
              {errors.date && (
                <div className="text-[#FC0000] text-sm">{errors.date}</div>
              )}
              <TextField
                type="date"
                name="date"
                variant="outlined"
                InputProps={{
                  className: " w-[300px] ",
                  readOnly: true,
                }}
                value={date}
                //onChange={(e) => setdate(e.target.value)}
                size="small"
                onBlur={handleBlur}
                error={!!errors.date}
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
                <div className="text-[#FC0000] text-sm">
                  {errors.description}
                </div>
              )}
              <TextField
                variant="outlined"
                InputProps={{
                  className: "w-[450px] h-[100px]",
                }}
                value={description}
                name="description"
                onChange={(e) => {
                  setdescription(e.target.value);
                  validateField("description", e.target.value);
                }}
                size="small"
                onBlur={handleBlur}
                error={!!errors.description}
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
                onClick={() => navigate(-1)}
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
