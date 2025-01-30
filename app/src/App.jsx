import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavigationBar from './components/Global/NavigationBar.jsx';
import HomePage from './pages/HomePage.jsx';
import QueriesPage from './pages/QueriesPage.jsx';
import TrafficMapPage from './pages/TrafficMapPage.jsx';
import './index.css';
import ManagerPage from './pages/ManagerPage.jsx';

const App = () => {
  return (
    <>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Queries" element={<QueriesPage />} />
        <Route path="/TrafficMap" element={<TrafficMapPage />} />
        <Route path="/Manager" element={<ManagerPage />} />
      </Routes>
    </>
  );
};

export default App;
