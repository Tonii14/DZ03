import HomeView from './components/views/HomeView'
import PassengersView from './components/views/PassengersView'
import FlightsView from './components/views/FligthsView'
import EditLineView from './components/views/editingViews/EditLineView'
import AddLineView from './components/views/addingViews/AddLineView'
import AddFlightView from './components/views/addingViews/AddFlightView'
import EditFlightView from './components/views/editingViews/EditFlightView'
import EditPassengerView from './components/views/editingViews/EditPassengerView'
import AddPassengerView from './components/views/addingViews/AddPassengerView'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" exact element={<HomeView />} />
          <Route path="/passengers" exact element={<PassengersView />} />
          <Route path="/flights" exact element={<FlightsView />} />
          <Route path="/editLine" exact element={<EditLineView />} />
          <Route path="/addLine" exact element={<AddLineView />} />
          <Route path="/flights/addFlight" exact element={<AddFlightView />} />
          <Route path="/flights/editFlight" exact element={<EditFlightView />} />
          <Route path="/passengers/editPassenger" exact element={<EditPassengerView />} />
          <Route path="/passengers/addPassenger" exact element={<AddPassengerView />} />
        </Routes>
    </Router>
  );
}

export default App;
