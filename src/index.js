import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import '../src/index.css'
import { StyledEngineProvider } from '@mui/material';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
    
      <App />
    </StyledEngineProvider>
  </React.StrictMode>
 
  
);

reportWebVitals();
