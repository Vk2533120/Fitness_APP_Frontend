// frontend/src/components/AddClassForm.jsx
import React, { useState } from 'react';
import { classesApi } from '../../api/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import LoadingSpinner from '../shared/LoadingSpinner.jsx';

function AddClassForm({ onClassAdded }) {
  const { user, showContextMessage } = useAuth();
  const [formData, setFormData] = useState({
    // --- CHANGES HERE TO MATCH BACKEND SCHEMA NAMES ---
    title: '', // Changed from 'name' to 'title'
    description: '',
    type: '', // Added 'type' field
    date: '',
    startTime: '', // Changed from 'time' to 'startTime'
    endTime: '', // Added 'endTime' field
    duration: '', // In minutes
    price: '', // Keep this for now, if you want to eventually add to schema
    capacity: '', // Changed from 'maxAttendees' to 'capacity'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!user || user.role !== 'trainer') {
      showContextMessage('Only trainers can add classes.', true);
      setLoading(false);
      return;
    }

    try {
      // The classData object now directly matches the backend schema names
      const classData = {
        ...formData,
        duration: parseInt(formData.duration),
        // price: parseFloat(formData.price), // Only include if you add 'price' to Class.js schema
        capacity: parseInt(formData.capacity),
        trainer: user._id, // Attach current trainer's ID
        // trainerName is not needed if you only store trainer ObjectId on backend
      };

      const response = await classesApi.createClass(classData);
      showContextMessage(response.data.message || 'Class added successfully!', false);
      setFormData({ // Reset form
        title: '',
        description: '',
        type: '',
        date: '',
        startTime: '',
        endTime: '',
        duration: '',
        price: '',
        capacity: '',
      });
      if (onClassAdded) {
        onClassAdded(response.data.class);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add class.';
      showContextMessage(errorMessage, true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto my-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Add New Fitness Class</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Class Name</label>
          <input
            type="text"
            id="title" // Changed from 'name'
            name="title" // Changed from 'name'
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            required
          ></textarea>
        </div>
        {/* ADD NEW FIELD FOR CLASS TYPE */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">Class Type</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            required
          >
            <option value="">Select Type</option>
            <option value="Yoga">Yoga</option>
            <option value="Cardio">Cardio</option>
            <option value="Strength">Strength</option>
            <option value="Pilates">Pilates</option>
            <option value="Zumba">Zumba</option>
            {/* Add more types as needed */}
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              required
            />
          </div>
          <div>
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
            <input
              type="time"
              id="startTime" // Changed from 'time'
              name="startTime" // Changed from 'time'
              value={formData.startTime}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              required
            />
          </div>
        </div>
        {/* ADD NEW FIELD FOR END TIME */}
        <div>
          <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time</label>
          <input
            type="time"
            id="endTime"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              required
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price ($)</label>
            <input
              type="number"
              id="price"
              name="price"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              required
            />
          </div>
          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">Max Attendees</label>
            <input
              type="number"
              id="capacity" // Changed from 'maxAttendees'
              name="capacity" // Changed from 'maxAttendees'
              value={formData.capacity}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              required
            />
          </div>
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Adding Class...' : 'Add Class'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddClassForm;