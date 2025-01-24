import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Success from './pages/Success';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';

function App() {
  // Obtener el estado inicial desde localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true'; // Convertir a booleano
  });

  // Función para manejar los cambios en la autenticación
  const handleAuthChange = (status) => {
    setIsAuthenticated(status); // Actualizar estado
    localStorage.setItem('isAuthenticated', status); // Actualizar localStorage
  };

  return (
    <Router>
      <Routes>
        {/* Página de login */}
        <Route
          path="/"
          element={<Login setAuth={handleAuthChange} />} // Pasar setAuth como prop
        />

        {/* Página protegida */}
        <Route
          path="/home"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Home setAuth={handleAuthChange}/>
            </ProtectedRoute>}
        />
      </Routes>
    </Router>
  );
}

export default App;
