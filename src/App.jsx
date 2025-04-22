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
import SearchPlant from './pages/SearchPlant';
import AddPlantDetails from './pages/AddPlantDetails';
import PlantSaved from './pages/PlantSaved';
import DefineLocation from './pages/DefineLocation';
import PlantIdentifier from './pages/PlantIdentifier';
import MeasurePlant from './pages/MeasurePlant';
import PlanPlotStart from './pages/PlanPlotStart';
import ManualPlot from './pages/ManualPlot';
import CustomPlotDraw from './pages/CustomPlotDraw';
import PlotPlants from './pages/PlotPlants';
import PlotPreferences from './pages/PlotPreferences';
import PlotConditions from './pages/PlotConditions';
import PlotLoading from './pages/PlotLoading';
import PlotLayoutDetails from './pages/PlotLayoutDetails';
import PlantDetail from './pages/PlantDetail';
import PlotLayoutGeneration from './pages/PlotLayoutGeneration';
import FinalizeLayout from './pages/FinalizeLayout';
import PlotLayoutView from './pages/PlotLayoutView';
import Profile from './pages/Profile';
import Plants from './pages/Plants';

// Import layout components
import BottomNav from './components/BottomNav';
import TopBar from './components/TopBar';

// Wrapper for layout logic
function AppWrapper() {
  const location = useLocation();
  const hideNavPaths = ['/', '/signup', '/tutorial', '/preferences'];
  const hideTopBarPaths = [...hideNavPaths, '/profile'];

  return (
    <>
      {/* Top bar logic */}
      {!hideTopBarPaths.includes(location.pathname) && <TopBar />}

      {/* Routes */}
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
        <Route path="/search-plant" element={<SearchPlant />} />
        <Route path="/add-plant-details" element={<AddPlantDetails />} />
        <Route path="/plant-saved" element={<PlantSaved />} />
        <Route path="/define-location" element={<DefineLocation />} />
        <Route path="/plant-identifier" element={<PlantIdentifier />} />
        <Route path="/measure-plant" element={<MeasurePlant />} />
        <Route path="/plan-plot-start" element={<PlanPlotStart />} />
        <Route path="/manual-plot" element={<ManualPlot />} />
        <Route path="/custom-plot" element={<CustomPlotDraw />} />
        <Route path="/plot-plants" element={<PlotPlants />} />
        <Route path="/plot-preferences" element={<PlotPreferences />} />
        <Route path="/plot-conditions" element={<PlotConditions />} />
        <Route path="/plot-loading" element={<PlotLoading />} />
        <Route path="/plot-layout-:layoutId" element={<PlotLayoutDetails />} />
        <Route path="/plant-detail/:plantName" element={<PlantDetail />} />
        <Route
          path="/plot-layout-generation"
          element={
            <PlotLayoutGeneration
              plotWidth={600}
              plotHeight={400}
              plants={['Tomato', 'Basil', 'Rosemary']}
            />
          }
        />
        <Route path="/finalize-layout" element={<FinalizeLayout />} />
        <Route path="/plot-layout-final" element={<PlotLayoutView />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/plants" element={<Plants />} />
      </Routes>

      {/* Bottom nav logic */}
      {!hideNavPaths.includes(location.pathname) && <BottomNav />}
    </>
  );
}

// Main App
function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;