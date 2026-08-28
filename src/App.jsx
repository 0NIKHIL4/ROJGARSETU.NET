import React from 'react';
import { HashRouter  as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import LabourerDashboard from './pages/LabourerDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import PostJob from './pages/PostJob';
import JobList from './pages/JobList';
import Profile from './pages/Profile';
import BrowseLabourers from './pages/BrowseLabourers';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

function AppContent() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={user ? <Navigate to={user.role === 'labourer' ? '/labourer-dashboard' : '/customer-dashboard'} /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to={user.role === 'labourer' ? '/labourer-dashboard' : '/customer-dashboard'} /> : <Register />} />
          <Route path="/labourer-dashboard" element={user?.role === 'labourer' ? <LabourerDashboard /> : <Navigate to="/login" />} />
          <Route path="/customer-dashboard" element={user?.role === 'customer' ? <CustomerDashboard /> : <Navigate to="/login" />} />
          <Route path="/post-job" element={user?.role === 'customer' ? <PostJob /> : <Navigate to="/login" />} />
          <Route path="/jobs" element={user ? <JobList /> : <Navigate to="/login" />} />
          <Route path="/browse-labourers" element={user?.role === 'customer' ? <BrowseLabourers /> : <Navigate to="/login" />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <AppContent />
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;