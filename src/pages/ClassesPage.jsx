import React, { useEffect, useState, useCallback } from 'react';
import ClassList from '../components/Classes/ClassList.jsx';
import LoadingSpinner from '../components/shared/LoadingSpinner.jsx';
import MessageDisplay from '../components/shared/MessageDisplay.jsx';
import { classesApi } from '../api/api.js';
import { useAuth } from '../context/AuthContext.jsx'; // To use showContextMessage

function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showContextMessage } = useAuth(); // Get message handler from context

  const fetchClasses = useCallback(async () => {
    setLoading(true);
    try {
      const response = await classesApi.getAllClasses();
      setClasses(response.data); // Assuming API returns an array of classes directly
    } catch (error) {
      console.error('Error fetching classes:', error);
      showContextMessage(error.response?.data?.message || 'Failed to load classes.', true);
      setClasses([]); // Clear classes on error
    } finally {
      setLoading(false);
    }
  }, [showContextMessage]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]); // Dependency array to ensure refetch only when needed

  // Function to refresh classes after a booking/cancellation from ClassCard
  const handleClassUpdate = useCallback(() => {
    fetchClasses();
  }, [fetchClasses]);


  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Our Fitness Classes</h1>
      <ClassList classes={classes} onBookOrCancelSuccess={handleClassUpdate} />
    </div>
  );
}

export default ClassesPage;