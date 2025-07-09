import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { Link, useNavigate } from 'react-router-dom';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, showContextMessage } = useAuth(); // Get message handler from context
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login({ email, password });
    if (success) {
      navigate('/dashboard'); // Redirect on successful login
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md mx-auto my-10">
      <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800">Welcome Back!</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
            placeholder="your@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-3 px-4 text-gray-800 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-md focus:outline-none focus:shadow-outline-purple transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="mt-8 text-center text-gray-600 text-sm">
        Don't have an account?{' '}
        <Link to="/register" className="text-purple-600 hover:text-purple-800 font-bold transition duration-200">
          Sign up here
        </Link>
      </p>
    </div>
  );
}

export default LoginForm;