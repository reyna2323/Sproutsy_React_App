import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Import pages
import Splash from './pages/Splash';
import SignUp from './pages/SignUp';
import Tutorial from './pages/Tutorial';
import Preferences from './pages/Preferences';
import Home from './pages/Home';
import GardenPlot from './pages/GardenPlot';
import AddPlant from './pages/AddPlant';
import ResetPrefs from './pages/ResetPrefs';
import Explore from './pages/Explore';

// Import BottomNav
import BottomNav from './components/BottomNav';

// Helper wrapper for routing with layout
function AppWrapper() {
  const location = useLocation();
  const hideNavPaths = ['/', '/signup', '/tutorial', '/preferences'];

  return (
    <>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/tutorial" element={<Tutorial />} />
        <Route path="/preferences" element={<Preferences />} />
        <Route path="/home" element={<Home />} />
        <Route path="/garden-plot" element={<GardenPlot />} />
        <Route path="/add-plant" element={<AddPlant />} />
        <Route path="/reset" element={<ResetPrefs />} />
        <Route path="/explore" element={<Explore />} />
      </Routes>

      {!hideNavPaths.includes(location.pathname) && <BottomNav />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;