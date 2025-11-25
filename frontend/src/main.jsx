import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import InternshipListPage from './pages/InternshipListPage';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InternshipListPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
