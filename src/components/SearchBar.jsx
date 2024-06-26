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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [itemsOptions, setItemsOptions] = useState([]);
  const [noResult, setNoResult] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchItemName = async () => {
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

    fetchItemName();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/inventory-item/search?itemName=${searchTerm}&itemGroup=${selectedCategories}`
      );
      if (response.status === 200) {
        if (response.data.length === 0) {
          setNoResult(true);
        } else {
          navigate("/search-result", {
            state: { searchResult: response.data },
          });
        }
      }
    } catch (error) {
      console.log(error);
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
        onInputChange={(event, newSearchTerm) => setSearchTerm(newSearchTerm)}
        // onClick={handleSearch}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Search an item"
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleFilterClick}>
                    <FilterListIcon className="mr-0" />
                  </IconButton>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    onClick={handleSearch}
                    style={{ cursor: "pointer" }}
                  />
                </InputAdornment>
              ),
              className: "text-gray-500 m-2 h-[30px] border-rounded-2xl ",
              sx: {
                "&:focus-within .MuiOutlinedInput-notchedOutline": {
                  borderColor: "transparent",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "transparent",
                },
              },
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
        <div className="p-2 flex flex-column">
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
              className="rounded-sm text-black"
              variant="outlined"
              onClick={handleSearch}
            >
              Apply Filters
            </Button>
          </FormGroup>
        </div>
      </Popover>
      <Dialog open={noResult} onClose={handleClose}>
        <DialogTitle>Sorry</DialogTitle>
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
