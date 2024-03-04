import React, { useState } from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

function SelectD({ value, onChange }) {
  const [selectedValue, setSelectedValue] = useState(value);

  const handleChange = (event) => {
    const newValue = event.target.value;
    setSelectedValue(newValue);
    onChange(newValue);  
  };

  const options = [
    { value: 'Programming', label: 'Programming' },
    { value: 'Cybersecurity', label: 'Cybersecurity' },
    { value: 'HR', label: 'HR' },
    { value: 'Development', label: 'Development' },
    { value: 'Communication', label: 'Communication' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Administration', label: 'Administration' },


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

export default SelectD;
