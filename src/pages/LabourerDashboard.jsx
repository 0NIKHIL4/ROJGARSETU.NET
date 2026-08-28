import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import JobCard from '../components/JobCard';
import { MapPin, Clock, Star, Briefcase, ToggleLeft, ToggleRight, Search } from 'lucide-react';

const LabourerDashboard = () => {
  const { user, updateProfile } = useAuth();
  const { jobs, assignJob } = useData();
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');

  if (!user) return null;

  const toggleAvailability = () => {
    updateProfile({ available: !user.available });
  };

  const handleAcceptJob = (jobId) => {
    assignJob(jobId, user.id, user.name);
  };

  const handleContactCustomer = (phone) => {
    window.open(`tel:${phone}`, '_self');
  };

  // Filter jobs based on user's skills and location
  const relevantJobs = jobs.filter(job => {
    const matchesSkill = !selectedSkill || job.skillRequired === selectedSkill;
    const matchesLocation = !searchLocation || job.location.toLowerCase().includes(searchLocation.toLowerCase());
    const matchesUserSkills = user.skills?.includes(job.skillRequired) || false;
    const isOpen = job.status === 'open';
    
    return matchesSkill && matchesLocation && matchesUserSkills && isOpen;
  });

  const assignedJobs = jobs.filter(job => job.assignedTo === user.id);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
              <p className="text-gray-600 mt-1">Find jobs matching your skills in your area</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Available to work:</span>
                <button
                  onClick={toggleAvailability}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    user.available 
                      ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {user.available ? (
                    <ToggleRight className="h-4 w-4" />
                  ) : (
                    <ToggleLeft className="h-4 w-4" />
                  )}
                  <span>{user.available ? 'Available' : 'Not Available'}</span>
                </button>
              </div>
              <Link
                to="/profile"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Edit Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Location</p>
                <p className="text-lg font-semibold text-gray-900">{user.location}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Briefcase className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Skills</p>
                <p className="text-lg font-semibold text-gray-900">{user.skills?.length || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Assigned Jobs</p>
                <p className="text-lg font-semibold text-gray-900">{assignedJobs.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available Jobs</p>
                <p className="text-lg font-semibold text-gray-900">{relevantJobs.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* My Skills */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">My Skills</h2>
          <div className="flex flex-wrap gap-2">
            {user.skills?.map((skill, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Job Search Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Find Jobs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search by Location
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  placeholder="Enter city or area"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Skill
              </label>
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Skills</option>
                {user.skills?.map(skill => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Available Jobs */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Jobs</h2>
          {relevantJobs.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No jobs available matching your skills and location.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relevantJobs.map(job => (
                <JobCard
                  key={job.id}
                  job={job}
                  onAccept={handleAcceptJob}
                  onContact={handleContactCustomer}
                  isLabourer={true}
                />
              ))}
            </div>
          )}
        </div>

        {/* Assigned Jobs */}
        {assignedJobs.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Assigned Jobs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assignedJobs.map(job => (
                <JobCard
                  key={job.id}
                  job={job}
                  onContact={handleContactCustomer}
                  showActions={false}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LabourerDashboard;