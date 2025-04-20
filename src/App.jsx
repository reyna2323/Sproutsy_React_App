import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Splash from './pages/Splash';
import SignUp from './pages/SignUp';
import Tutorial from './pages/Tutorial';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Splash />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/tutorial' element={<Tutorial />} />
        <Route path='/home' element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;