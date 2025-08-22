import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./components/Register";
import Login from './components/Login';
import Notes from './components/Notes';
import PrivateRoute from './components/PrivateRoute';

function App() {
  // const [token] = useState(localStorage.getItem("token") || '');
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/notes"
          element={
            <PrivateRoute>
              <Notes />
            </PrivateRoute>
          }
        />
        {/* <Route path="*" element={<Navigate to="/login" />} /> */}
      </Routes>
    </Router>
  );
}

export default App;