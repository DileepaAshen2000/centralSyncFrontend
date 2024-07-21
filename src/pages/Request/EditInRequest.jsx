import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { TextField, Grid, Box, Typography, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';
import LoginService from '../Login/LoginService';
import { set } from 'date-fns';

const EditInventoryRequest = () => {

  const [previousItemName, setPreviousItemName] = useState("");
  const [previousQuantity, setPreviousQuantity] = useState(0);
  const [availableQuantity, setAvailableQuantity] = useState(0);
  const [createdDate, setCreatedDate] = useState("");
  const [createdTime, setCreatedTime] = useState("");
  const [updatedDateTime, setUpdatedDateTime] = useState("");
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [empId, setEmpId] = useState("");
  const [department, setDepartment] = useState("");
  const [createdBy, setCreatedBy] = useState(""); 
  const [items, setItems] = useState([]); 
  const [files, setFiles] = useState([]);
  const [fileErrors, setFileErrors] = useState("");
  const [workSite, setWorkSite] = useState("");
  const[previousBrand, setPreviousBrand] = useState("");
  const[previousModel, setPreviousModel] = useState("");
  const [brands, setBrands] = useState([]);
const [models, setModels] = useState([]);
  const [errors, setErrors] = useState({});
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(true); // Loading state
  const [itemId, setItemId] = useState("");

  const { reqId } = useParams();
  const navigate = useNavigate();

  const isEmployee = LoginService.isEmployee();
  const isReqHandler = LoginService.isReqHandler();
  const userID = LoginService.returnUserID();
  const isOnlineEmployee = LoginService.isOnlineEmployee();

  const formatDate = (dateArray) => {
    if (!dateArray) return { formattedDate: "", formattedTime: "" };
    const [year, month, day, hour, minute, second] = dateArray;
    const date = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
    const formattedDate = date.toISOString().split('T')[0]; 
    const formattedTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`; 
    return { formattedDate, formattedTime };
  };
  const fetchWorkSite = () => {
    const workSite = LoginService.isOnlineEmployee() ? "ONLINE" : "ONSITE";
    setWorkSite(workSite);
  };

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:8080/inventory-item/getAll');
      setItems(response.data);
    } catch (error) {
      console.log(error);
    }
  };


  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/request/getById/${reqId}`);
        const data = response.data;
        setPreviousQuantity(data.quantity);
        const { formattedDate, formattedTime } = formatDate(data.creationDateTime);
        setCreatedDate(formattedDate);
        setCreatedTime(formattedTime);
        setUpdatedDateTime(formatDate(data.updateDateTime).formattedDate);
        setReason(data.reason);
        setDescription(data.description);
        setEmpId(data.userId);
        setItemId(data.itemId);

        const userResponse = await axios.get(`http://localhost:8080/user/users/${data.userId}`);
        const userData = userResponse.data;
        setCreatedBy(userData.firstName);
        setDepartment(userData.department);

        const itemResponse = await axios.get(`http://localhost:8080/inventory-item/getById/${data.itemId}`);
        const item = itemResponse.data;
        setPreviousItemName(item.itemName);
        setAvailableQuantity(item.quantity);
        setPreviousBrand(item.brand);
        setPreviousModel(item.model);

        const brandResponse = await axios.get(`http://localhost:8080/inventory-item/getBrandsByItemName?itemName=${item.itemName}`);
        setBrands(brandResponse.data);

        const modelResponse = await axios.get(`http://localhost:8080/inventory-item/getModelsByItemNameAndBrand?itemName=${item.itemName}&brand=${item.brand}`);
        const modelsData = modelResponse.data;
        setModels(modelsData);
        
        if (modelsData.length > 0) {
          setPreviousModel(modelsData[0]); // Set the first model or some logic to choose a model
        }

        setLoading(false);
        setInitialLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
        setInitialLoading(false);
      }
    };

    fetchData();
    fetchItems();
  }, [reqId]);
  

  const handleItemNameChange = async (e) => {
    const selectedItemName = e.target.value;
    setPreviousItemName(selectedItemName);
  
    // Fetch and set brands based on selected item name
    try {
      const response = await axios.get(`http://localhost:8080/inventory-item/getBrandsByItemName?itemName=${selectedItemName}`);
      setBrands(response.data);
      setPreviousBrand(""); // Reset brand when item name changes
      setPreviousModel(""); // Reset model when item name changes
      setModels([]); // Reset models when item name changes
    } catch (error) {
      console.log(error);
    }
  };
  

  const handleBrandChange = async (e) => {
    const selectedBrand = e.target.value;
    setPreviousBrand(selectedBrand);

    try {
      const response = await axios.get(`http://localhost:8080/inventory-item/getModelsByItemNameAndBrand?itemName=${previousItemName}&brand=${selectedBrand}`);
      const modelsData = response.data;
      setModels(modelsData);
      
      if (modelsData.length > 0) {
        setPreviousModel(modelsData[0]);
      }
    } catch (error) {
      console.log(error);
      setModels([]);
    }
  };
  

  const handleModelChange = async (e) => {
    setPreviousModel(e.target.value);
  };

  
  const handleQuantityChange = (e) => {
    setPreviousQuantity(e.target.value);
  };
  
  const handleReasonChange = (e) => {
    if (e.target.value.length <= 50) {
      setReason(e.target.value);
    }
  };

  const handleDescriptionChange = (e) => {
    const words = e.target.value.split(/\s+/);
    if (words.length <= 50) {
      setDescription(e.target.value);
    }
  };

  const isPositiveNumber = (value) => {
    return !isNaN(value) && Number(value) > 0;
  };

  const validate = () => {
    let tempErrors = {};
    
  if (!previousQuantity) tempErrors.previousQuantity = "Quantity is required.";
  else if (!isPositiveNumber(previousQuantity)) tempErrors.previousQuantity = "Quantity must be a positive number.";
  else if (previousQuantity > availableQuantity) tempErrors.previousQuantity = "Quantity exceeds available stock.";
  if (!reason) tempErrors.reason = "Reason is required.";
  else if (reason.length > 50)
    tempErrors.reason = "Reason must be 50 characters or less";
  if (description.split(/\s+/).length > 50)
    tempErrors.description = "Description must be 150 words or less";
  if (fileErrors) tempErrors.files = fileErrors;
  setErrors(tempErrors);
  console.log('Validation errors:', tempErrors);
  return Object.keys(tempErrors).length === 0;
  };


  const handleSave = (e) => {
    e.preventDefault();
    console.log('Save button clicked');
    if (!validate()) 

      {
        console.log('Validation failed');
        return;


      }
console.log('Validation passed');
    const formData = new FormData();
    formData.append("quantity", previousQuantity);
    formData.append("reason", reason);
    formData.append("description", description);
    formData.append("userId", empId);
    formData.append("itemId", itemId);
    for (let i = 0; i < files.length; i++) {
      formData.append("file", files[i]);
    }

    axios
      .put(`http://localhost:8080/request/updateById/${reqId}`, formData)
      .then(() => {
        console.log("Successfully updated");
        navigate(getInventoryRequestListLink());
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    const errors = [];
    const pdfFiles = [];
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      if (file.type !== "application/pdf") {
        errors.push(`${file.name} is not a PDF file.`);
      } else if (file.size > 5 * 1024 * 1024) {
        errors.push(`${file.name} exceeds the 5MB size limit.`);
      } else {
        pdfFiles.push(file);
      }
    }

    if (errors.length > 0) {
      setFileErrors(errors.join(" "));
    } else {
      setFileErrors("");
      setFiles(pdfFiles);
    }
  };

  const getInventoryRequestListLink = () => {
    if (isReqHandler) return "/requestHandler/in-request-list";
    if(isOnlineEmployee) return "/employee-de-request-list"
    return  "/employee-in-request-list";
  };

  const getUniqueItems = (items) => {
    const uniqueItems = [];
    const itemNames = new Set();

    items.forEach((item) => {
      if (!itemNames.has(item.itemName)) {
        itemNames.add(item.itemName);
        uniqueItems.push(item);
      }
    });

    return uniqueItems;
  };

  if (loading || initialLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }
  console.log(models);
    return (
        <form>
          <Box className='p-10 bg-white rounded-2xl ml-14 mr-14'>
          {workSite === "ONLINE" ? (
            <Box className="w-full bg-green-900 text-white text-center py-4 m-4">
              <h1 className="pt-2 pb-3 text-3xl font-bold">Edit Delivery Request</h1>
            </Box>
          ) : (
            <Box className="flex flex-col items-center pb-4">
              <Box className="w-full bg-blue-900 text-white text-center py-4 m-4">
                <header className="text-3xl font-bold">Edit Inventory Request</header>
              </Box>
            </Box>
          )}
          
            <Grid container spacing={2} padding={4}>
              <Grid container display='flex' mt={4}>
                <Grid item sm={1.5}>
                  <Typography>Ref no.</Typography>
                </Grid>
                <Grid item sm={4.5}>
                  <TextField
                    size='small'
                    style={{ width: '300px' }}
                    inputProps={{
                      readOnly: true,
                      style: { color: 'gray' },
                    }}
                    value={reqId}
                  />
                </Grid>
              </Grid>
              <Grid container display='flex' mt={4}>
                <Grid item sm={1.5}>
                  <Typography>Item Name</Typography>
                </Grid>
                <Grid item sm={4.5}>
                <TextField
                    size='small'
                    style={{ width: '300px' }}
                    inputProps={{
                      readOnly: true,
                      style: { color: 'gray' },
                    }}
                    value={previousItemName}
                    onChange={(e) => setPreviousItemName(e.target.value)}
                  />
                </Grid>
                <Grid item sm={1.5}>
                  <Typography>Brand</Typography>
                </Grid>
                <Grid item sm={4.5}>
                <TextField
                    size='small'
                    style={{ width: '300px' }}
                    inputProps={{
                      readOnly: true,
                      style: { color: 'gray' },
                    }}
                    value={previousBrand}
                    onChange={(e) => setPreviousBrand(e.target.value)}
                  />
                </Grid>
              </Grid>
              <Grid container display="flex" mt={4}style={{ height: "80px" }}>
              <Grid item sm={1.5}>
                  <Typography>Model</Typography>
                </Grid>
                <Grid item sm={4.5}>
                <TextField
                    size='small'
                    style={{ width: '300px' }}
                    inputProps={{
                      readOnly: true,
                      style: { color: 'gray' },
                    }}
                    value={previousModel}
                    onChange={(e) => setPreviousModel(e.target.value)}
                  />
                </Grid>

                <Grid item sm={1.5}>
                  <Typography>Quantity</Typography>
                </Grid>
                <Grid item sm={4.5}>
                <TextField
                size='small'
                  variant="outlined"
                  fullWidth
                  type="positiveNumber"
                  value={previousQuantity}
                  onChange={handleQuantityChange}
                  onBlur={validate}
                  error={Boolean(errors.previousQuantity)}
                  helperText={errors.previousQuantity
                    ? errors.previousQuantity
                    : `${availableQuantity} available`
                } 
                  required
                />
                </Grid>
              </Grid>
            
              <Grid container display='flex' mt={4}>
                <Grid item sm={1.5}>
                  <Typography>Created Date</Typography>
                </Grid>
                <Grid item sm={4.5}>
                  <TextField
                    size='small'
                    style={{ width: '300px' }}
                    inputProps={{
                      readOnly: true,
                      style: { color: 'gray' },
                    }}
                    value={createdDate}
                    onChange={(e) => setCreatedDate(e.target.value)}
                  />
                </Grid>
                <Grid item sm={1.5}>
                  <Typography>Created Time</Typography>
                </Grid>
                <Grid item sm={4.5}>
                  <TextField
                    size='small'
                    style={{ width: '300px' }}
                    inputProps={{
                      readOnly: true,
                      style: { color: 'gray' },
                    }}
                    value={createdTime}
                    onChange={(e) => setCreatedTime(e.target.value)}
                  />
                </Grid>
              </Grid>


              <Grid container display='flex' mt={4}>
                <Grid item sm={1.5}>
                  <Typography>Created By</Typography>
                </Grid>
                <Grid item sm={4.5}>
                  <TextField
                    size='small'
                    style={{ width: '300px' }}
                    inputProps={{
                      readOnly: true,
                      style: { color: 'gray' },
                    }}
                    value={createdBy}
                  />
                </Grid>
                <Grid item sm={1.5}>
                  <Typography>Employee.ID</Typography>
                </Grid>
                <Grid item sm={4.5}>
                  <TextField
                    size='small'
                    style={{ width: '300px' }}
                    inputProps={{
                      readOnly: true,
                      style: { color: 'gray' },
                    }}
                    value={empId}
                  />
                </Grid>
              </Grid>


              <Grid container display='flex' mt={4}>

                <Grid item sm={1.5}>
                  <Typography>Department</Typography>
                </Grid>
                <Grid item sm={4.5}>
                  <TextField
                    size='small'
                    style={{ width: '300px' }}
                    inputProps={{
                      readOnly: true,
                      style: { color: 'gray' },
                    }}
                    value={department}
                  />
                </Grid>
              </Grid>
              
              <Grid container display='flex' mt={4}>
              <Grid item sm={1.5}>
                  <Typography>Reason</Typography>
                </Grid>
                <Grid item sm={4.5}>
                <TextField
                    id="reason"
                    value={reason}
                    style={{ width: "300px" }}
                    onChange={handleReasonChange}
                    name="reason"
                    size="small"
                    error={Boolean(errors.reason)}
                    helperText={errors.reason
                      ? errors.reason
                      : `${reason.length}/50 characters`
                  } 
                  />
                </Grid>
                </Grid>
              <Grid container display='flex' mt={4}>
              
              </Grid>

              <Grid container display='flex' mt={4}>
                <Grid item sm={1.5}>
                  <Typography>Description</Typography>
                </Grid>
                <Grid item sm={4.5}>
                <TextField
                    label="Description"
                    name="description"
                    multiline
                    rows={6}
                    placeholder="Enter Description Here..."
                    style={{ width: "500px" }}
                    value={description}
                    onChange={handleDescriptionChange}
                    error={!!errors.description}
                    helperText={
                      errors.description
                        ? errors.description
                        : `${description.split(/\s+/).length}/50 words`
                    }
                  />
                </Grid>
              </Grid>
            </Grid>

            <Box mt={4}>
              {workSite === "ONLINE" ? (
                <Typography display="block" gutterBottom>
                  Attach File(s) to Delivery request
                </Typography>
              ) : (
                <Typography display="block" gutterBottom>
                  Attach File(s) to Inventory request
                </Typography>
              )}
             <input
              id="files"
              name="files"
              type="file"
              multiple
              onChange={handleFileChange}
              accept="application/pdf"
            />
               {fileErrors && (
              <Typography color="error" variant="body2">
                {fileErrors}
              </Typography>
            )}
                <Typography variant="body2" color="textSecondary">
              Upload PDF files up to 5MB.
            </Typography>
            </Box>

            <div className='flex gap-6 mt-6 ml-[70%]'>
              <Button
                className="px-6 py-2 text-white bg-blue-600 rounded"
                variant='contained'
                type='submit'
                onClick={handleSave}
              >
                Save
              </Button>

              <Button
                className="px-6 py-2 rounded"
                variant='outlined'
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
            </div>
          </Box>
        </form>
    
    
  );
};

export default EditInventoryRequest;
