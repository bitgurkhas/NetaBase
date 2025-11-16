import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react'; 

const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <App /> 
    <SpeedInsights /> 
    <Analytics />
  </StrictMode>
);
