import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './IntegratedApp';
import './integrated.css';
import './experience.css';
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
