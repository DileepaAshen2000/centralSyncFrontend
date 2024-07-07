import React, { useState, useEffect } from "react";
import {
  TextField,
  Autocomplete,
  IconButton,
  InputAdornment,
  Popover,
  Checkbox,
  FormControlLabel,
  Button,
  FormGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [itemsOptions, setItemsOptions] = useState([]);
  const [noResult, setNoResult] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchItemNames = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/inventory-item/getAll"
        );
        const data = response.data.map((item) => ({
          itemName: item.itemName,
          itemGroup: item.itemGroup,
        }));
        setItemsOptions(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchItemNames();
  }, []);

  const handleSearch = async (term) => {
    if (!term) {
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:8080/inventory-item/search?itemName=${term}&itemGroup=${selectedCategories}`
      );
      if (response.status === 200) {
        if (response.data.length === 0) {
          setNoResult(true);
        } else {
          navigate("/search-result", {
            state: {
              searchResult: response.data,
              currentRoute: location.pathname,
              searchTerm: term,
            },
          });
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSearchTerm("");
    }
  };

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const open = Boolean(filterAnchorEl);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      }
      return [...prev, category];
    });
  };

  const handleClose = () => {
    setNoResult(false);
  };

  const categories = [
    "COMPUTERS_AND_LAPTOPS",
    "COMPUTER_ACCESSORIES",
    "COMPUTER_HARDWARE",
    "PRINTERS_AND_SCANNERS",
    "OFFICE_SUPPLIES",
    "FURNITURE",
    "OTHER",
  ];
  const categoryMapping = {
    COMPUTERS_AND_LAPTOPS: "Computers & Laptops",
    COMPUTER_ACCESSORIES: "Computer Accessories",
    PRINTERS_AND_SCANNERS: "Printers & Scanners",
    COMPUTER_HARDWARE: "Computer Hardware",
    FURNITURE: "Furniture",
    OFFICE_SUPPLIES: "Office supplies",
    OTHER: "Other",
  };
  return (
    <div className="relative  bg-opacity-15  ml-5 md:w-[400px] sm:mr-3 sm:w-auto">
      <Autocomplete
        value={searchTerm}
        options={itemsOptions
          .filter(
            (item, index, self) =>
              self.findIndex((t) => t.itemName === item.itemName) === index
          )
          .map((item) => item.itemName)}
        onChange={(event, selectedOption) => {
          if (selectedOption) {
            setSearchTerm(selectedOption);
            handleSearch(selectedOption);
          }
        }}
        onInputChange={(event, newSearchTerm) => setSearchTerm(newSearchTerm)}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Search an item"
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              className: "text-gray-500 m-2 h-[30px] ",
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton onClick={handleFilterClick}>
                    <FilterListIcon className="mr-0" />
                  </IconButton>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="start">
                  <Tooltip title="Search">
                    <SearchIcon
                      onClick={handleSearch}
                      style={{ cursor: "pointer" }}
                    />
                  </Tooltip>
                  
                </InputAdornment>
              ),

              // sx: {
              //   "&:focus-within .MuiOutlinedInput-notchedOutline": {
              //     borderColor: "transparent",
              //   },
              //   "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              //     borderColor: "transparent",
              //   },
              // },
            }}
          />
        )}
      />
      <Popover
        open={open}
        anchorEl={filterAnchorEl}
        onClose={handleFilterClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <div className="flex p-2 flex-column">
          <FormGroup>
            {categories.map((category) => (
              <FormControlLabel
                key={category}
                control={
                  <Checkbox
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                  />
                }
                label={categoryMapping[category]}
              />
            ))}
            <Button
              className="text-black rounded-sm"
              variant="outlined"
              onClick={() => handleSearch(searchTerm)}
            >
              Apply Filters
            </Button>
          </FormGroup>
        </div>
      </Popover>
      <Dialog open={noResult} onClose={handleClose}>
        <DialogTitle>Sorry!</DialogTitle>
        <DialogContent>
          <DialogContentText>
            No results were found for "{searchTerm}"
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SearchBar;
