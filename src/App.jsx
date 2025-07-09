import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layout Components
import Header from './components/Layout/Header.jsx';
import Footer from './components/Layout/Footer.jsx';

// Auth Components & Pages
import LoginForm from './components/Auth/LoginForm.jsx';
import RegisterForm from './components/Auth/RegisterForm.jsx'; // Using RegisterForm as a component/page directly

// Pages
import HomePage from './pages/HomePage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ClassesPage from './pages/ClassesPage.jsx';
import MyBookingsPage from './pages/MyBookingsPage.jsx';
import AddClassPage from './pages/AddClassPage.jsx';
import TrainerListingPage from './pages/TrainerListingPage';
import TrainerProfilePage from './pages/TrainerProfilePage';
import TrainerProfileEditPage from './pages/TrainerProfileEditPage'; // Already imported, good!
import FeedbackPage from './pages/FeedbackPage'; 

// Context
import { AuthProvider, useAuth } from './context/AuthContext.jsx';

// Shared Components
import LoadingSpinner from './components/shared/LoadingSpinner.jsx';
import MessageDisplay from './components/shared/MessageDisplay.jsx';

// A helper component for protected routes
const ProtectedRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />; // Show loading spinner while auth status is being determined
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />; // Redirect to login if not authenticated
  }

  if (roles.length > 0 && user && !roles.includes(user.role)) {
    // Redirect if user role is not authorized for this route
    // You might want a specific "Unauthorized" page here
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};


function AppContent() {
  const { message, isError, loading } = useAuth(); // Access global message and loading from AuthContext

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
      <Header />
      {loading && <LoadingSpinner />} {/* Global loading spinner based on auth context */}
      {message && <MessageDisplay message={message} isError={isError} />} {/* Global message display */}

      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />

          {/* New Trainer Routes (Publicly Accessible for viewing) */}
          <Route path="/trainers" element={<TrainerListingPage />} />
          <Route path="/trainers/:id" element={<TrainerProfilePage />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/classes" element={
            <ProtectedRoute>
              <ClassesPage />
            </ProtectedRoute>
          } />
          <Route path="/my-bookings" element={
            <ProtectedRoute>
              <MyBookingsPage />
            </ProtectedRoute>
          } />
          {/* Trainer specific routes */}
          <Route path="/add-class" element={
            <ProtectedRoute roles={['trainer']}>
              <AddClassPage />
            </ProtectedRoute>
          } />
          {/* Trainer Profile Edit Route (Only for authenticated trainers) */}
          <Route path="/trainer/edit-profile" element={
            <ProtectedRoute roles={['trainer']}>
              <TrainerProfileEditPage />
            </ProtectedRoute>
          } />
          <Route path="/feedback" element={
            <ProtectedRoute> {/* Anyone logged in can give general feedback */}
              <FeedbackPage />
            </ProtectedRoute>
          } />
          {/* Redirect authenticated users from login/register */}
          {/* These should typically be placed AFTER other specific routes */}
          {/* If a user is already authenticated and tries to go to /login or /register,
              they will be redirected to /dashboard. This needs to be carefully placed
              to not interfere with the initial login/register process. */}
          {/* Consider moving these to the top if you want them to always take precedence */}
          {/* For now, leaving them here as they are in your original structure */}
          <Route
            path="/login"
            element={useAuth().isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginForm />}
          />
          <Route
            path="/register"
            element={useAuth().isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterForm />}
          />


          {/* Fallback for undefined routes */}
          {/* This should generally be the very last route */}
          <Route path="*" element={
            <div className="text-center py-20">
              <h1 className="text-4xl font-bold text-gray-800">404 - Not Found</h1>
              <p className="text-lg text-gray-600 mt-4">The page you are looking for does not exist.</p>
              {/* Optionally redirect to home or dashboard if logged in */}
              <Navigate to="/" />
            </div>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;