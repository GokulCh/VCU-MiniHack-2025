import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavigationBar from './components/Global/NavigationBar.jsx';
import HomePage from './pages/HomePage.jsx';
import TrafficMapPage from './pages/TrafficMapPage.jsx';
import './index.css';

const App = () => {
  return (
    <>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/TrafficMap" element={<TrafficMapPage />} />
      </Routes>
    </>
  );
};

export default App;
