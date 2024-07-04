import {
  Button,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Backdrop,
  CircularProgress,
  Popover,
  MenuList,
} from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const EditItem = () => {
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const { itemID } = useParams();
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [inventoryItem, setInventoryItem] = useState({
    itemName: "",
    itemGroup: "",
    unit: "",
    brand: "",
    dimension: "",
    weight: "",
    description: "",
    quantity: "",
    status: "",
    image: null,
  });

  const {
    itemName,
    itemGroup,
    unit,
    brand,
    dimension,
    weight,
    description,
    quantity,
    status,
    
  } = inventoryItem;

  const onInputChange = (e) => {
    setInventoryItem({ ...inventoryItem, [e.target.name]: e.target.value });
    setValidationErrors({ ...validationErrors, [e.target.name]: "" });
  };

  const onItemGroupChange = (e) => {
    setInventoryItem({ ...inventoryItem, itemGroup: e.target.value });
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setInventoryItem({ ...inventoryItem, image: file });

    // Create a preview URL for the selected image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  useEffect(() => {
    const fetchItemDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8080/inventory-item/getById/${itemID}`
        );
        const item = {
          itemName: response.data.itemName,
          itemGroup: response.data.itemGroup,
          unit: response.data.unit,
          brand: response.data.brand,
          dimension: response.data.dimension,
          weight: response.data.weight,
          description: response.data.description,
          quantity: response.data.quantity,
          status: response.data.status,
          image: response.data.image,
        };
        setInventoryItem(item);
        setImagePreview(`data:image/*;base64,${item.image}`);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [itemID]);

  const handleSave = async (e) => {
    e.preventDefault();
    const frontEndValidation = validateInputs();
    if (Object.keys(frontEndValidation).length > 0) {
      setValidationErrors(frontEndValidation);
      // return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append(
      "item",
      new Blob(
        [
          JSON.stringify({
            itemName,
            itemGroup,
            unit,
            brand,
            dimension,
            weight,
            description,
            quantity,
            status,
          }),
        ],
        { type: "application/json" }
      )
    );

    formData.append("image", inventoryItem.image);

    try {
      const response = await axios.put(
        `http://localhost:8080/inventory-item/updateById/${itemID}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Item details successfully edited!",
        });
        navigate("/item");
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to edit item details. Please check your inputs.",
      });
      if (error.response) {
        setErrors(error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };
  const handleMoreButton = (event) => {
    setAnchorEl(event.currentTarget);
    setIsOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setIsOpen(false);
  };

  const handleDelete = async () => {
    setIsOpen(false);
    setLoading(true);
    try {
      await axios.delete(
        `http://localhost:8080/inventory-item/deleteItem/${itemID}`
      );
      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Inventory Item deleted successfully!",
      }).then(() => {
        navigate(-1);
      });
    } catch (error) {
      if (error.response.status === 409) {
        Swal.fire({
          icon: "error",
          title: "Cannot delete item",
          text: "Inventory Item is currently in use and cannot be deleted.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An unexpected error occurred.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsInactiveButton = () => {
    setIsOpen(false);
    setLoading(true);
    axios
      .patch(`http://localhost:8080/inventory-item/markAsInactive/${itemID}`)
      .then(() => {
        navigate(-1);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleMarkAsActiveButton = () => {
    setIsOpen(false);
    setLoading(true);
    axios
      .patch(`http://localhost:8080/inventory-item/markAsActive/${itemID}`)
      .then(() => {
        navigate(-1);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const validateInputs = () => {
    const errors = {};
    if (!itemName) {
      errors.itemName = "Item Name is required";
    }
    if (!itemGroup) {
      errors.itemGroup = "Item group is required";
    }
    if (!unit) {
      errors.itemGroup = "Unit is required";
    }
    if (!brand) {
      errors.itemGroup = "Brand is required is required";
    }
    if (!dimension) {
      errors.itemGroup = "Dimension is required";
    }
    if (!weight) {
      errors.itemGroup = "Weight is required";
    }
    if (!quantity) {
      errors.itemGroup = "Quantity is required";
    }
    return errors;
  };
  return (
    <>
      <form
        onSubmit={(e) => handleSave(e)}
        className="grid grid-cols-8 gap-y-10 p-10 bg-white rounded-2xl ml-14 mr-14"
      >
        <h1 className=" col-span-4 text-3xl pt-2  font-bold">Item Details</h1>
        <div className="col-start-1 col-span-4 flex items-center">
          {inventoryItem.image && (
            <img
              src={imagePreview}
              alt={inventoryItem.itemName}
              className="w-[300px] ml-5"
              onClick={() => fileInputRef.current.click()}
            />
          )}
          <p className="text-sm text-gray-500 mt-2">
            Click the image to change it
          </p>
          <input
            type="file"
            ref={fileInputRef}
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
        <div className="col-start-1 col-span-4 flex items-center">
          <InputLabel htmlFor="itemID" className="flex-none text-black w-32 ">
            Item Id
          </InputLabel>
          <TextField
            value={itemID}
            name="itemId"
            variant="outlined"
            InputProps={{
              className: "w-[300px] h-10 ml-5 bg-white  ",
            }}
          />
        </div>

        <div className="col-start-1 col-span-4 flex items-center">
          <InputLabel htmlFor="name" className="flex-none text-black w-32 ">
            Item Name
          </InputLabel>
          <div>
            {errors.itemName && (
              <div className="text-[#FC0000] text-xs ml-6 my-1">
                {errors.itemName}
              </div>
            )}
            <TextField
              name="itemName"
              value={itemName}
              onChange={onInputChange}
              variant="outlined"
              error={!!validationErrors.itemName}
              helperText={validationErrors.itemName}
              InputProps={{
                className: "w-[300px] h-10 ml-5 bg-white  ",
                readOnly: false,
              }}
            />
          </div>
        </div>

        <div className="col-start-1 col-span-4 flex items-center">
          <InputLabel
            htmlFor="itemGroup"
            className="flex-none text-black w-32 "
          >
            Item Group
          </InputLabel>
          <div className="flex-grow">
            {errors.itemGroup && (
              <div className="text-[#FC0000] text-xs ml-6 my-1">
                {errors.itemGroup}
              </div>
            )}
            <Select
              name="itemGroup"
              value={itemGroup}
              onChange={onItemGroupChange}
              className="w-[300px] h-10 ml-5 bg-white  "
              error={!!validationErrors.itemGroup}
              helperText={validationErrors.itemGroup}
            >
              <MenuItem value="COMPUTERS_AND_LAPTOPS">
                Computers & Laptops
              </MenuItem>
              <MenuItem value="COMPUTER_ACCESSORIES">
                Computer Accessories
              </MenuItem>
              <MenuItem value="COMPUTER_HARDWARE">Computer Hardware</MenuItem>
              <MenuItem value="PRINTERS_AND_SCANNERS">
                Printers & Scanners
              </MenuItem>
              <MenuItem value="FURNITURE">Furniture</MenuItem>
              <MenuItem value="OFFICE_SUPPLIES">Office Supplies</MenuItem>
              <MenuItem value="OTHER">Other</MenuItem>
            </Select>
          </div>
        </div>

        <div className="col-start-1 col-span-4 flex ">
          <InputLabel htmlFor="unit" className="flex-none text-black w-32 ">
            Unit
          </InputLabel>
          <div>
            {errors.unit && (
              <div className="text-[#FC0000] text-xs ml-6 my-1">
                {errors.unit}
              </div>
            )}
            <TextField
              value={unit}
              onChange={onInputChange}
              name="unit"
              variant="outlined"
              error={!!validationErrors.unit}
              //helperText={validationErrors.unit}
              InputProps={{
                className: "w-[300px] h-10 ml-5 bg-white  ",
              }}
              helperText="The quantity measurement unit(e.g., pcs, kg, boxes,)."
            />
          </div>
        </div>
        <div className="col-start-1 col-span-4 flex items-center">
          <InputLabel htmlFor="brand" className="flex-none text-black w-32 ">
            Brand
          </InputLabel>
          <div>
            {errors.brand && (
              <div className="text-[#FC0000] text-xs ml-6 my-1">
                {errors.brand}
              </div>
            )}
            <TextField
              value={brand}
              onChange={onInputChange}
              name="brand"
              variant="outlined"
              error={!!validationErrors.brand}
              helperText={validationErrors.brand}
              InputProps={{
                className: "w-[300px] h-10 ml-5 bg-white  ",
              }}
            />
          </div>
        </div>
        <div className="col-start-1 col-span-4 flex items-center">
          <InputLabel
            htmlFor="dimension"
            className="flex-none text-black  w-32"
          >
            Dimension
          </InputLabel>
          <TextField
            value={dimension}
            onChange={onInputChange}
            name="dimension"
            variant="outlined"
            error={!!validationErrors.dimension}
            helperText={validationErrors.dimension}
            InputProps={{
              className: "w-[300px] h-10 ml-5 bg-white  ",
              readOnly: false,
            }}
          />
        </div>
        <div className="col-start-1 col-span-4 flex items-center">
          <InputLabel htmlFor="weight" className="flex-none text-black  w-32">
            Weight
          </InputLabel>
          <TextField
            value={weight}
            onChange={onInputChange}
            name="weight"
            variant="outlined"
            error={!!validationErrors.weight}
            helperText={validationErrors.weight}
            InputProps={{
              className: "w-[300px] h-10 ml-5 bg-white  ",
              readOnly: false,
            }}
          />
        </div>
        <div className="col-start-1 col-span-4 flex">
          <InputLabel
            htmlFor="description"
            className="flex-none text-black  w-32 mt-0"
          >
            Description
          </InputLabel>
          <TextField
            value={description}
            onChange={onInputChange}
            name="description"
            variant="outlined"
            multiline
            rows={6}
            InputProps={{
              className: "w-[500px] ml-5 bg-white  ",
              readOnly: false,
            }}
          />
        </div>
        <div className="col-start-1 col-span-4 flex items-center">
          <InputLabel htmlFor="quantity" className="flex-none text-black w-32 ">
            Initial Quantity
          </InputLabel>
          <div>
            {errors.quantity && (
              <div className="text-[#FC0000] text-xs ml-6 my-1">
                {errors.quantity}
              </div>
            )}
            <TextField
              value={quantity}
              onChange={onInputChange}
              name="quantity"
              variant="outlined"
              error={!!validationErrors.quantity}
              helperText={validationErrors.quantity}
              InputProps={{
                className: "w-[300px] h-10 ml-5 bg-white  ",
                readOnly: false,
              }}
            />
          </div>
        </div>

        <>
          <Button
            variant="contained"
            type="submit"
            className="row-start-12 col-start-5 col-span-2 rounded-sm bg-blue-600 ml-10"
          >
            Save changes
          </Button>
          <Button
            variant="outlined"
            className="row-start-12 col-start-8 rounded-sm bg-white text-blue-60blue-600"
            onClick={() => navigate("/item")}
          >
            Cancel
          </Button>
        </>
        <>
          <Button
            variant="contained"
            className="row-start-1 col-start-6 rounded-sm bg-blue-600 ml-10 w-[180px]"
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
              {console.log("inventoryItem.status:", inventoryItem.status)}
              {inventoryItem.status === "ACTIVE" ? (
                <MenuItem>
                  <Button
                    variant="contained"
                    className="col-start-6 rounded-sm  bg-blue-500 ml-10 w-[180px]"
                    onClick={handleMarkAsInactiveButton}
                  >
                    Mark as Inactive
                  </Button>
                </MenuItem>
              ) : (
                <MenuItem>
                  <Button
                    variant="contained"
                    className="col-start-6 rounded-sm  bg-blue-500 ml-10 w-[180px]"
                    onClick={handleMarkAsActiveButton}
                  >
                    Mark as Active
                  </Button>
                </MenuItem>
              )}
              <MenuItem>
                <Button
                  variant="contained"
                  className="col-start-6 rounded-sm bg-red-500 ml-10 w-[180px]"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </MenuItem>
            </MenuList>
          </Popover>
        </>
      </form>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default EditItem;
