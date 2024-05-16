import React from 'react';

const FileTest = () => {
  const uploadFile = async (e) => {
    e.preventDefault();
    const fileInput = document.querySelector('input[type="file"]');
    const file = fileInput.files[0];
    if (!file) {
      console.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8080/file', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        console.log('File uploaded successfully');
      } else {
        console.error('Failed to upload file');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const downloadFile = async () => {
    try {
      const response = await fetch('http://localhost:8080/file/IN2511_b21assignment4 (1).pdf', {
        method: 'GET',
        // Add any headers if required
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'file_name'; // You can specify the file name here
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        console.error('Failed to download file');
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <div className='flex items-center justify-center h-screen bg-blue-300'>
      <div className='text-white bg-blue-500 h-[50%] w-[50%] flex flex-col gap-8 p-6'>
        <h1>File Upload Testing..</h1>
        <input type='file' />
        <div className='flex items-center justify-center gap-4 mt-8'>
          <button onClick={uploadFile} className='p-4 text-black bg-green-300 rounded-md'>
            Upload
          </button>
          <button onClick={downloadFile} className='p-4 text-white bg-red-300 rounded-md'>
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileTest;
