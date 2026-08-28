import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import JobCard from '../components/JobCard';
import { Plus, Briefcase, Clock, MapPin, Users, Star, X } from 'lucide-react';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const { getJobsByCustomer, updateJobStatus, addReview } = useData();

  const [selectedJobForReview, setSelectedJobForReview] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  if (!user) return null;

  const myJobs = getJobsByCustomer(user.id);
  const openJobs = myJobs.filter(job => job.status === 'open');
  const assignedJobs = myJobs.filter(job => job.status === 'assigned');
  const completedJobs = myJobs.filter(job => job.status === 'completed');

  const handleContactLabourer = (phone) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleOpenReviewModal = (job) => {
    setSelectedJobForReview(job);
    setRating(5);
    setComment('');
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!selectedJobForReview) return;

    setSubmittingReview(true);
    try {
      // 1. Mark job as completed
      await updateJobStatus(selectedJobForReview.id, 'completed');

      // 2. Add review if worker assigned
      if (selectedJobForReview.assignedTo) {
        await addReview({
          jobId: selectedJobForReview.id,
          reviewerId: user.id,
          reviewerName: user.name,
          targetUserId: selectedJobForReview.assignedTo,
          rating,
          comment
        });
      }

      setSelectedJobForReview(null);
    } catch (err) {
      console.error('Error submitting review:', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
              <p className="text-gray-600 mt-1">Manage your job postings and find skilled workers</p>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/post-job"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow"
              >
                <Plus className="h-4 w-4" />
                <span>Post New Job</span>
              </Link>
              <Link
                to="/browse-labourers"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center space-x-2 shadow"
              >
                <Users className="h-4 w-4" />
                <span>Browse Workers</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Briefcase className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{myJobs.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Open Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{openJobs.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <MapPin className="h-8 w-8 text-amber-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{assignedJobs.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{completedJobs.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* My Jobs */}
        <div className="space-y-8">
          {/* Assigned / In Progress Jobs */}
          {assignedJobs.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <span className="w-3 h-3 bg-amber-500 rounded-full"></span>
                <span>Jobs in Progress</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assignedJobs.map(job => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onContact={handleContactLabourer}
                    onComplete={handleOpenReviewModal}
                    showActions={false}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Open Jobs */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Open Jobs</h2>
            {openJobs.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No open jobs. Post a new job to start hiring skilled workers!</p>
                <Link
                  to="/post-job"
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Post Job</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {openJobs.map(job => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onContact={handleContactLabourer}
                    showActions={false}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Completed Jobs */}
          {completedJobs.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Completed Jobs</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedJobs.map(job => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onContact={handleContactLabourer}
                    showActions={false}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {selectedJobForReview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl relative">
            <button
              onClick={() => setSelectedJobForReview(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Complete Job & Rate Worker</h3>
            <p className="text-sm text-gray-600 mb-4">
              Rate your experience with <strong className="text-gray-900">{selectedJobForReview.assignedLabourerName || 'Worker'}</strong> for "{selectedJobForReview.title}".
            </p>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 focus:outline-none"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Review Comment</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  placeholder="Share feedback on quality of work, punctuality, etc."
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedJobForReview(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 shadow disabled:opacity-50"
                >
                  {submittingReview ? 'Submitting...' : 'Submit & Complete'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;