import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import '../src/index.css'
import { StyledEngineProvider } from '@mui/material';
import { BrowserRouter as Router } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      {/* <Router> */}
        <App />
      {/* </Router> */}
    </StyledEngineProvider>
  </React.StrictMode>
 
  
);

reportWebVitals();
