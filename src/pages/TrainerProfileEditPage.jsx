// frontend/src/pages/TrainerProfileEditPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { trainerApi } from '../api/api';
import { useNavigate } from 'react-router-dom';

function TrainerProfileEditPage() {
  const { user, showContextMessage, fetchUser } = useAuth(); // fetchUser to refresh user data after update
  const navigate = useNavigate();

  const [qualifications, setQualifications] = useState('');
  const [expertise, setExpertise] = useState('');
  const [specializations, setSpecializations] = useState('');
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [videoIntro, setVideoIntro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Populate form with current user data if available and they are a trainer
    if (user && user.role === 'trainer') {
      setQualifications(user.qualifications ? user.qualifications.join(', ') : '');
      setExpertise(user.expertise ? user.expertise.join(', ') : '');
      setSpecializations(user.specializations ? user.specializations.join(', ') : '');
      setBio(user.bio || '');
      setLoading(false);
    } else if (user && user.role !== 'trainer') {
      showContextMessage('You are not authorized to access this page.', true);
      navigate('/'); // Redirect non-trainers
    }
  }, [user, navigate, showContextMessage]);

  const handleUpdateTextProfile = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const profileData = {
        qualifications: qualifications.split(',').map(s => s.trim()).filter(s => s),
        expertise: expertise.split(',').map(s => s.trim()).filter(s => s),
        specializations: specializations.split(',').map(s => s.trim()).filter(s => s),
        bio,
      };
      const response = await trainerApi.updateTrainerProfile(profileData);
      showContextMessage(response.data.message || 'Profile updated successfully!', false);
      await fetchUser(); // Refresh user context
    } catch (error) {
      console.error('Profile update error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update profile.';
      showContextMessage(errorMessage, true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData();
    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }
    if (videoIntro) {
      formData.append('videoIntro', videoIntro);
    }

    if (!profilePicture && !videoIntro) {
        showContextMessage('Please select a file to upload.', true);
        setSubmitting(false);
        return;
    }

    try {
      const response = await trainerApi.uploadTrainerFiles(formData);
      showContextMessage(response.data.message || 'Files uploaded successfully!', false);
      await fetchUser(); // Refresh user context to show new picture/video
      setProfilePicture(null); // Clear selected file
      setVideoIntro(null); // Clear selected file
      document.getElementById('profilePictureInput').value = ''; // Clear file input
      document.getElementById('videoIntroInput').value = ''; // Clear file input
    } catch (error) {
      console.error('File upload error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to upload files.';
      showContextMessage(errorMessage, true);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center text-xl mt-8">Loading profile editor...</div>;
  }

  return (
    <div className="container mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Edit Your Trainer Profile</h2>

      {/* Profile Picture & Video Preview */}
      <div className="mb-8 p-4 border rounded-md bg-gray-50 text-center">
        <h3 className="text-xl font-semibold mb-4">Current Profile Media</h3>
        {user.profilePicture && (
          <div className="mb-4">
            <p className="font-semibold mb-2">Profile Picture:</p>
            <img src={user.profilePicture} alt="Profile" className="w-32 h-32 rounded-full object-cover mx-auto" />
          </div>
        )}
        {user.videoIntro && (
          <div className="mb-4">
            <p className="font-semibold mb-2">Introductory Video:</p>
            <video controls src={user.videoIntro} className="w-full max-w-sm mx-auto"></video>
          </div>
        )}
        {!user.profilePicture && !user.videoIntro && <p className="text-gray-600">No profile media uploaded yet.</p>}
      </div>

      {/* Text Fields Form */}
      <form onSubmit={handleUpdateTextProfile} className="mb-8 p-6 border rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Update Text Information</h3>
        <div className="mb-4">
          <label htmlFor="qualifications" className="block text-gray-700 text-sm font-bold mb-2">Qualifications (comma-separated):</label>
          <input
            type="text"
            id="qualifications"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={qualifications}
            onChange={(e) => setQualifications(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="expertise" className="block text-gray-700 text-sm font-bold mb-2">Expertise (comma-separated):</label>
          <input
            type="text"
            id="expertise"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={expertise}
            onChange={(e) => setExpertise(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="specializations" className="block text-gray-700 text-sm font-bold mb-2">Specializations (comma-separated):</label>
          <input
            type="text"
            id="specializations"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={specializations}
            onChange={(e) => setSpecializations(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label htmlFor="bio" className="block text-gray-700 text-sm font-bold mb-2">Bio / Introductory Message:</label>
          <textarea
            id="bio"
            rows="5"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength="1000"
            placeholder="Tell clients about yourself..."
          ></textarea>
          <p className="text-xs text-gray-500 mt-1">{bio.length}/1000 characters</p>
        </div>
        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={submitting}
        >
          {submitting ? 'Updating...' : 'Update Profile'}
        </button>
      </form>

      {/* File Upload Form */}
      <form onSubmit={handleFileUpload} className="p-6 border rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Upload Media</h3>
        <div className="mb-4">
          <label htmlFor="profilePictureInput" className="block text-gray-700 text-sm font-bold mb-2">Upload Profile Picture:</label>
          <input
            type="file"
            id="profilePictureInput"
            accept="image/*"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onChange={(e) => setProfilePicture(e.target.files[0])}
          />
        </div>
        <div className="mb-6">
          <label htmlFor="videoIntroInput" className="block text-gray-700 text-sm font-bold mb-2">Upload Introductory Video:</label>
          <input
            type="file"
            id="videoIntroInput"
            accept="video/*"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onChange={(e) => setVideoIntro(e.target.files[0])}
          />
        </div>
        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={submitting}
        >
          {submitting ? 'Uploading...' : 'Upload Media'}
        </button>
      </form>
    </div>
  );
}

export default TrainerProfileEditPage;