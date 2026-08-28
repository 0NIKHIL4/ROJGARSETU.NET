import React from 'react';
import { Clock, MapPin, DollarSign, User, Phone, CheckCircle } from 'lucide-react';

const JobCard = ({ 
  job, 
  onAccept, 
  onContact, 
  onComplete,
  showActions = true, 
  isLabourer = false 
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800 border-green-200';
      case 'assigned': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleAccept = () => {
    if (onAccept) {
      onAccept(job.id);
    }
  };

  const handleContact = () => {
    if (onContact) {
      onContact(job.customerPhone);
    }
  };

  const handleComplete = () => {
    if (onComplete) {
      onComplete(job);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 pr-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{job.description}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(job.status)}`}>
            {job.status ? job.status.toUpperCase() : 'OPEN'}
          </span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-gray-700">{job.location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-green-500" />
            <span className="text-sm text-gray-700">{new Date(job.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-bold text-emerald-700">₹{job.wage}</span>
          </div>
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-medium text-gray-700">{job.skillRequired}</span>
          </div>
        </div>
      </div>
      
      <div className="border-t pt-4 mt-2">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div>
            <span>Posted by: </span>
            <span className="font-semibold text-gray-800">{job.customerName}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Phone className="h-3 w-3 text-gray-400" />
            <span>{job.customerPhone}</span>
          </div>
        </div>
        
        {job.status === 'assigned' && job.assignedLabourerName && (
          <div className="mb-3 p-2.5 bg-amber-50 border border-amber-200 rounded-md flex items-center justify-between">
            <span className="text-xs text-amber-900">
              Assigned to: <strong className="font-semibold">{job.assignedLabourerName}</strong>
            </span>
            {onComplete && (
              <button
                onClick={handleComplete}
                className="inline-flex items-center space-x-1 px-2.5 py-1 bg-green-600 text-white text-xs font-semibold rounded hover:bg-green-700 transition-colors"
              >
                <CheckCircle className="h-3 w-3" />
                <span>Complete & Rate</span>
              </button>
            )}
          </div>
        )}

        {showActions && (
          <div className="flex space-x-2">
            {job.status === 'open' && isLabourer && (
              <button
                onClick={handleAccept}
                className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
              >
                Accept Job
              </button>
            )}
            <button
              onClick={handleContact}
              className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Contact Customer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobCard;