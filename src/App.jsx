import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Fosil from './pages/Fosil';
import Mineral from './pages/Mineral';
import Roca from './pages/Roca';
import Investigacion from './pages/Investigacion';
import Perfil from './pages/Perfil';
import Profiles from './pages/Profiles';
import AcercaDeCreador from './pages/AcercaDeCreador';

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
              <Home setAuth={handleAuthChange} />
            </ProtectedRoute>}
        />
        {/* Rutas Adicionales */}
        <Route
          path="/fosil"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Fosil setAuth={handleAuthChange} />
            </ProtectedRoute>}
        />
        <Route
          path="/mineral"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Mineral setAuth={handleAuthChange} />
            </ProtectedRoute>}
        />
        <Route
          path="/roca"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Roca setAuth={handleAuthChange} />
            </ProtectedRoute>}
        />
        <Route
          path="/investigacion"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Investigacion setAuth={handleAuthChange} />
            </ProtectedRoute>}
        />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Perfil setAuth={handleAuthChange} />
            </ProtectedRoute>}
        />
        <Route
          path="/aboutCreator"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AcercaDeCreador setAuth={handleAuthChange} />
            </ProtectedRoute>}
        />
        <Route
          path="/profiles"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Profiles setAuth={handleAuthChange} />
            </ProtectedRoute>}
        />
      </Routes>
    </Router>
  );
}

export default App;
