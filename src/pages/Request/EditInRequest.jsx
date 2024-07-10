import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { TextField, Grid, Box, Typography, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';
import LoginService from '../Login/LoginService';

const EditInventoryRequest = () => {

  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
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
  const [workSite, setWorkSite] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true); // Loading state

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

  useEffect(() => {
    axios
      .get(`http://localhost:8080/inventory-item/getAll`)
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
      fetchWorkSite();
  }, []);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/request/getById/${reqId}`)
      .then((response) => {
        const data = response.data;
        setQuantity(data.quantity);
        const { formattedDate, formattedTime } = formatDate(data.creationDateTime);
        setCreatedDate(formattedDate);
        setCreatedTime(formattedTime);
        setUpdatedDateTime(formatDate(data.updateDateTime).formattedDate);
        setReason(data.reason);
        setDescription(data.description);
        setEmpId(data.userId);

        axios.get(`http://localhost:8080/user/users/${data.userId}`)
          .then((userResponse) => {
            const userData = userResponse.data;
            setCreatedBy(userData.firstName);
            setDepartment(userData.department);
          })
          .catch((error) => {
            console.log(error);
          });

        const item = items.find(item => item.itemId === data.itemId);
        if (item) {
          setItemName(item.itemName);
          setAvailableQuantity(item.quantity);
        }

        setLoading(false); // Set loading to false once data is fetched
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false); // Set loading to false even if there's an error
      });
  }, [reqId, items]);

  const isPositiveNumber = (value) => {
    return !isNaN(value) && Number(value) > 0;
  };

  const validate = () => {
    let tempErrors = {};
    if (!quantity) {
      tempErrors.quantity = "Quantity is required.";
    } else if (!isPositiveNumber(quantity)) {
      tempErrors.quantity = "Quantity must be a positive number.";
    }else if (quantity > availableQuantity)
      tempErrors.quantity = "Quantity exceeds available stock.";
    if (!reason) tempErrors.reason = "Reason is required.";
    if (!description) tempErrors.description = "Description is required.";
    if (files.length > 5) tempErrors.files = "You can upload a maximum of 5 files.";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    formData.append("quantity", quantity);
    formData.append("reason", reason);
    formData.append("description", description);
    formData.append("userId", empId);
    formData.append("itemId", items.find(item => item.itemName === itemName)?.itemId);
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
    setFiles(e.target.files);
  };

  const getInventoryRequestListLink = () => {
    if (isReqHandler) return "/requestHandler/in-request-list";
    if(isOnlineEmployee) return "/employee-de-request-list"
    return  "/employee-in-request-list";
  };

  return (
    <>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      ) : (
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
                  <Typography>Reason</Typography>
                </Grid>
                <Grid item sm={4.5}>
                  <TextField
                    size='small'
                    style={{ width: '300px' }}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    error={!!errors.reason}
                    helperText={errors.reason}
                  />
                </Grid>
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

              <Grid container display='flex' mt={4}></Grid>
              
              <Grid container display='flex' mt={4}>
                <Grid item sm={1.5}>
                  <Typography>Item Name</Typography>
                </Grid>
                <Grid item sm={4.5}>
                  <FormControl size="small" style={{ width: '300px' }}>
                    <InputLabel id="itemName-label">Item Name</InputLabel>
                    <Select
                      labelId="itemName-label"
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                    >
                      {items.map((item) => (
                        <MenuItem key={item.itemId} value={item.itemName}>
                          {item.itemName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              
              <Grid container display='flex' mt={4}>
                <Grid item sm={1.5}>
                  <Typography>Quantity</Typography>
                </Grid>
                <Grid item sm={4.5}>
                  <TextField
                    size='small'
                    style={{ width: '300px' }}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    error={!!errors.quantity}
                    helperText={errors.quantity ||
                      `Available quantity: ${availableQuantity}`}
                  />
                </Grid>
              </Grid>

              <Grid container display='flex' mt={4}>
                <Grid item sm={1.5}>
                  <Typography>Description</Typography>
                </Grid>
                <Grid item sm={4.5}>
                  <TextField
                    size='small'
                    style={{ width: '300px' }}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    error={!!errors.description}
                    helperText={errors.description}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Box className="mt-4 mb-2">
            {workSite === "ONLINE" ? (
                <Typography display="block" gutterBottom>
                  Attach File(s) to Delivery Request
                </Typography>
              ) : (
                <Typography display="block" gutterBottom>
                  Attach File(s) to Inventory Request
                </Typography>
              )}
              <input type="file" className="mt-4 mb-2" onChange={handleFileChange} multiple />
              <Typography variant="caption" display="block" gutterBottom>
                You can upload a maximum of 5 files, 5MB each
              </Typography>
              {errors.files && (
                <Typography color="error" variant="caption">
                  {errors.files}
                </Typography>
              )}
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
      )}
    </>
  );
};

export default EditInventoryRequest;
