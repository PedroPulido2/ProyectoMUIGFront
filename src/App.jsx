import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Success from './pages/Success';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado para autenticación

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Login setAuth={setIsAuthenticated} />} // Pasar setAuth como prop
        />
        <Route
          path="/success"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Success />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
