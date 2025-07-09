import axios from 'axios';


const API_BASE_URL = import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- API Endpoints ---

// Authentication API
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getUserProfile: () => api.get('/auth/me'),
};

// Classes API
export const classesApi = {
  getAllClasses: () => api.get('/classes'),
  getTrainerClasses: (trainerId) => api.get(`/classes/trainer/${trainerId}`),
  createClass: (classData) => api.post('/classes', classData),
  updateClass: (id, classData) => api.put(`/classes/${id}`, classData),
  deleteClass: (id) => api.delete(`/classes/${id}`),
};

// Bookings API
export const bookingsApi = {
  bookClass: (bookingData) => api.post('/bookings', bookingData),
  getMyBookings: () => api.get('/bookings/my-bookings'), 
  cancelBooking: (bookingId) => api.put(`/bookings/${bookingId}/cancel`),
  rescheduleBooking: (bookingId, newBookingDate) => api.put(`/bookings/${bookingId}`, { bookingDate: newBookingDate }),
};

export const trainerApi = {
    getTrainers: () => api.get('/trainers'),
    getTrainerProfile: (id) => api.get(`/trainers/${id}`),
    updateTrainerProfile: (profileData) => api.put('/trainers/profile', profileData),
    uploadTrainerFiles: (formData) => api.post('/trainers/profile/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
    addReview: (trainerId, reviewData) => api.post(`/trainers/${trainerId}/reviews`, reviewData),
    getTrainerReviews: (trainerId) => api.get(`/trainers/${trainerId}/reviews`),
  };



export const feedbackApi = {
    submitFeedback: (feedbackData) => api.post('/feedback', feedbackData),
    getFeedback: (params) => api.get('/feedback', { params }), // Use params for trainerId or type
  };

export const paymentsApi = {
  createPaymentIntent: (amount) => api.post('/payments/create-payment-intent', { amount }),
  confirmPayment: (paymentIntentId) => api.post('/payments/confirm', { paymentIntentId }),
};


export default api;