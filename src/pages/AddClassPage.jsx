import React, { useCallback } from 'react';
import AddClassForm from '../components/Classes/AddClassForm.jsx';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function AddClassPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Basic check: Redirect if not a trainer (should also be handled by ProtectedRoute in App.jsx)
  if (user?.role !== 'trainer') {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
        <p className="text-lg text-gray-600 mt-4">You must be a trainer to add classes.</p>
        <button onClick={() => navigate('/dashboard')} className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Go to Dashboard
        </button>
      </div>
    );
  }

  const handleClassAdded = useCallback((newClass) => {
    
    navigate('/dashboard'); 
  }, [navigate]);

  return (
    <div className="container mx-auto px-4 py-8">
      <AddClassForm onClassAdded={handleClassAdded} />
    </div>
  );
}

export default AddClassPage;