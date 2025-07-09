// frontend/src/pages/DashboardPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function DashboardPage() {
  const { user } = useAuth();

  const dashboardItems = [
    {
      title: 'Explore Classes',
      description: 'Find and book a variety of fitness classes.',
      icon: '🏋️',
      bgColor: 'bg-purple-600',
      link: '/classes',
      disabled: false,
    },
    {
      title: 'My Bookings',
      description: 'View, reschedule, or cancel your booked sessions.',
      icon: '📅',
      bgColor: 'bg-green-600',
      link: '/my-bookings',
      disabled: false,
    },
    {
      title: 'Add New Class',
      description: 'Create and manage your fitness classes.',
      icon: '➕',
      bgColor: 'bg-orange-600',
      link: '/add-class',
      disabled: user?.role !== 'trainer',
      comingSoon: user?.role !== 'trainer' ? true : false,
    },
    {
      title: 'Trainer Profiles',
      description: 'Discover detailed trainer profiles.',
      icon: '👤',
      bgColor: 'bg-blue-600',
      link: '/trainers',
      disabled: false,
      comingSoon: false,
    },
    {
      title: 'Recommendations',
      description: 'Coming Soon: Personalized class suggestions.',
      icon: '💡',
      bgColor: 'bg-gray-400',
      link: '#',
      disabled: true,
      comingSoon: true,
    },
    {
      title: 'Feedback',
      description: 'Provide feedback on classes and trainers.', // <--- Updated description
      icon: '💬',
      bgColor: 'bg-yellow-600', // <--- Choose a new color
      link: '/feedback', // <--- IMPORTANT: Link to the new feedback page
      disabled: false, // <--- No longer disabled
      comingSoon: false, // <--- No longer coming soon
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Welcome, {user ? user.name : 'Guest'}!</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardItems.map((item, index) => (
          <DashboardCard
            key={index}
            title={item.title}
            description={item.description}
            icon={item.icon}
            bgColor={item.bgColor}
            link={item.link}
            disabled={item.disabled}
            comingSoon={item.comingSoon}
          />
        ))}
      </div>
    </div>
  );
}

const DashboardCard = ({ title, description, icon, bgColor, link, disabled, comingSoon }) => {
  const CardContent = (
    <div className={`p-6 rounded-lg shadow-md text-white flex flex-col items-center justify-center h-48 ${bgColor} ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 transition-transform duration-300'}`}>
      <div className="text-5xl mb-3">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm text-center">{description}</p>
      {comingSoon && (
        <span className="mt-2 text-xs font-bold bg-white text-gray-800 px-2 py-1 rounded-full">
          Coming Soon
        </span>
      )}
    </div>
  );

  return (
    <div className="relative">
      {disabled ? (
        CardContent
      ) : (
        <Link to={link} className="block">
          {CardContent}
        </Link>
      )}
    </div>
  );
};

export default DashboardPage;