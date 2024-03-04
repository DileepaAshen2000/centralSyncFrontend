import React from 'react';
import { DropzoneArea } from 'material-ui-dropzone';
//import './StyledDropzoneArea.css';

function StyledDropzoneArea(props) {
  return (
    <div className="p-4 rounded-md w-[500px] h-4 pl-[100px]">
      <DropzoneArea
         {...props}
        classes={{
          root: 'bg-red-100 h-[270px]', 
          text: 'text-black',  
        }}
      />
    </div>
  );
}

function Dropzone() {
  return (
    <div>
      <StyledDropzoneArea
        acceptedFiles={['image/*']}
        dropzoneText="Drag and drop an image here or click"
        onChange={(files) => console.log('Files:', files)}
        
      />
    </div>
  );
}

export default Dropzone;

 


