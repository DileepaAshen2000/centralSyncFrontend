import React, { useState } from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

function SelectR({ value, onChange }) {
  const [selectedValue, setSelectedValue] = useState(value);

  const handleChange = (event) => {
    const newValue = event.target.value;
    setSelectedValue(newValue);
    onChange(newValue); // Call the parent component's onChange handler with the new value
  };

  const options = [
    { value: 'Web Developer', label: 'Web Developer' },
    { value: 'Software Architect', label: 'Software Architect' },
    { value: 'System Analyst', label: 'System Analyst' },
  ];

  return (
    <Select
      value={selectedValue}
      onChange={handleChange}
      className="w-[375px] cursor-auto h-9 border border-[#857A7A] rounded-xl px-2 "
    >
      {options.map(option => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  );
}

export default SelectR;
