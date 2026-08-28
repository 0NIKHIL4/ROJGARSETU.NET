import React from 'react';
import { MapPin, Star, Briefcase, Phone, CheckCircle } from 'lucide-react';

const LabourerCard = ({ 
  labourer, 
  onHire, 
  onContact, 
  showActions = true 
}) => {
  const handleHire = () => {
    if (onHire) {
      onHire(labourer.id);
    }
  };

  const handleContact = () => {
    if (onContact) {
      onContact(labourer.phone);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{labourer.name}</h3>
            {labourer.available && (
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-xs text-green-600 font-medium">Available</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-700">{labourer.location}</span>
          </div>
          <div className="flex items-center space-x-2 mb-3">
            <Phone className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-700">{labourer.phone}</span>
          </div>
        </div>
        {!labourer.available && (
          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
            Not Available
          </span>
        )}
      </div>
      
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Skills</h4>
        <div className="flex flex-wrap gap-2">
          {labourer.skills.map((skill, index) => (
            <span 
              key={index}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          {labourer.rating && (
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-900">{labourer.rating}</span>
            </div>
          )}
          {labourer.completedJobs && (
            <div className="flex items-center space-x-1">
              <Briefcase className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700">{labourer.completedJobs} jobs</span>
            </div>
          )}
        </div>
      </div>
      
      {showActions && labourer.available && (
        <div className="flex space-x-3">
          <button
            onClick={handleHire}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Hire Now
          </button>
          <button
            onClick={handleContact}
            className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Contact
          </button>
        </div>
      )}
    </div>
  );
};

export default LabourerCard;