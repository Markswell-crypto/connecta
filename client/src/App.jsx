import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './layouts/Header';
import Footer from './layouts/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

// ProtectedRoute component
const ProtectedRoute = ({ children, currentUser }) => {
  return currentUser ? children : <Navigate to="/login" replace />;
};

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  // Check localStorage for user on app load
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const handleLogin = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Header 
          currentUser={currentUser} 
          onLogin={handleLogin} 
          onLogout={handleLogout} 
        />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register onLogin={handleLogin} />} />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute currentUser={currentUser}>
                  <Profile currentUser={currentUser} onLogout={handleLogout} />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;