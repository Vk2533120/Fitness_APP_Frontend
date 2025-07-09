// frontend/src/components/Trainers/TrainerCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function TrainerCard({ trainer }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-lg">
      <Link to={`/trainers/${trainer._id}`} className="block">
        <div className="p-5 flex flex-col items-center text-center">
          {trainer.profilePicture && (
            <img
              src={trainer.profilePicture}
              alt={trainer.name}
              className="w-28 h-28 rounded-full object-cover mb-4 border-2 border-purple-400"
            />
          )}
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{trainer.name}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-3">{trainer.bio || 'No bio available.'}</p>

          {trainer.expertise && trainer.expertise.length > 0 && (
            <p className="text-gray-700 text-sm mb-2">
              <span className="font-semibold">Expertise:</span> {trainer.expertise.slice(0, 2).join(', ')}
              {trainer.expertise.length > 2 ? '...' : ''}
            </p>
          )}

          <div className="flex items-center space-x-1 text-yellow-500 text-lg">
            {'⭐'.repeat(Math.round(trainer.averageRating))}
            <span className="text-gray-700 text-sm">
              ({trainer.averageRating ? trainer.averageRating.toFixed(1) : '0.0'})
            </span>
          </div>
          <span className="text-gray-500 text-xs mt-1">({trainer.reviewCount || 0} Reviews)</span>
        </div>
      </Link>
    </div>
  );
}

export default TrainerCard;