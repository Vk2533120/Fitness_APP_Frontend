import React from 'react';
import ClassCard from './ClassCard.jsx';

function ClassList({ classes, onBookOrCancelSuccess }) {
  if (!classes || classes.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600 text-lg">No classes available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {classes.map((fitnessClass) => (
        <ClassCard
          key={fitnessClass._id}
          fitnessClass={fitnessClass}
          onBookSuccess={onBookOrCancelSuccess}
          onCancelSuccess={onBookOrCancelSuccess}
        />
      ))}
    </div>
  );
}

export default ClassList;