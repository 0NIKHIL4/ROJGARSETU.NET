import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import LabourerCard from '../components/LabourerCard';
import { Search, MapPin, Filter, Users } from 'lucide-react';

const BrowseLabourers = () => {
  const { user } = useAuth();
  const { labourers } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [skillFilter, setSkillFilter] = useState('');

  if (!user || user.role !== 'customer') return null;

  const handleHire = (labourerId) => {
    // In a real app, this would open a job posting form or direct hire flow
    alert('Hire functionality would be implemented here');
  };

  const handleContact = (phone) => {
    window.open(`tel:${phone}`, '_self');
  };

  // Filter labourers based on search and filters
  const filteredLabourers = labourers.filter(labourer => {
    const matchesSearch = labourer.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !locationFilter || labourer.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesSkill = !skillFilter || labourer.skills.includes(skillFilter);
    
    return matchesSearch && matchesLocation && matchesSkill;
  });

  // Get unique skills from all labourers
  const allSkills = [...new Set(labourers.flatMap(labourer => labourer.skills))];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Skilled Workers</h1>
          <p className="text-gray-600">
            Find and hire skilled workers in your area
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Workers
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  placeholder="Enter city or area"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skill
              </label>
              <div className="relative">
                <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <select
                  value={skillFilter}
                  onChange={(e) => setSkillFilter(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Skills</option>
                  {allSkills.map(skill => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            Showing {filteredLabourers.length} worker{filteredLabourers.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Workers Grid */}
        {filteredLabourers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No workers found</p>
            <p className="text-gray-400">Try adjusting your search filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLabourers.map(labourer => (
              <LabourerCard
                key={labourer.id}
                labourer={labourer}
                onHire={handleHire}
                onContact={handleContact}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseLabourers;