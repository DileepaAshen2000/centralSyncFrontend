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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import axios from "axios";

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/inventory-item/getAll"
        );
        const data = response.data.map((item) => ({
          itemName: item.itemName,
          itemGroup: item.itemGroup,
        }));
        setItems(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = () => {
    onSearch({ term: searchTerm, categories: selectedCategories });
  };

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      }
      return [...prev, category];
    });
  };

  const open = Boolean(filterAnchorEl);
  const id = open ? "simple-popover" : undefined;

  const categories = [
    "COMPUTER_ACCESSORIES",
    "PRINTER",
    "COMPUTER_HARDWARE",
    "OTHER",
  ];
  const categoryMapping = {
    COMPUTER_ACCESSORIES: "Computer Accessories",
    PRINTER: "Printer",
    COMPUTER_HARDWARE: "Computer Hardware",
    OTHER: "Other",
  };
  return (
    <div className="relative  bg-opacity-15  ml-5 md:w-[400px] sm:mr-3 sm:w-auto">
      {/* hover:bg-opacity-25 */}
      <Autocomplete
        value={searchTerm}
        options={items.map((item) => item.itemName)}
        onInputChange={(event, newSearchTerm) => setSearchTerm(newSearchTerm)}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Search"
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    onClick={handleSearch}
                    style={{ cursor: "pointer" }}
                  />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleFilterClick}>
                    <FilterListIcon className="mr-0" />
                  </IconButton>
                </InputAdornment>
              ),
              className: "text-gray-500 m-2 h-[30px] border-rounded-2xl bg-red-50",
            }}
          />
        )}
      />
      <Popover
        id={id}
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
            <Button className="rounded-sm text-black" variant="outlined" onClick={handleSearch}>
              Apply Filters
            </Button>
          </FormGroup>
        </div>
      </Popover>
    </div>
  );
};

export default SearchBar;
