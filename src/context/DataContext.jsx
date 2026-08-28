import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [labourers, setLabourers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = useCallback(async () => {
    try {
      const data = await api.getJobs();
      setJobs(data);
    } catch (err) {
      console.warn('API fetchJobs failed, loading sample/local data:', err);
      const savedJobs = localStorage.getItem('jobs');
      if (savedJobs) {
        setJobs(JSON.parse(savedJobs));
      }
    }
  }, []);

  const fetchLabourers = useCallback(async () => {
    try {
      const data = await api.getLabourers();
      setLabourers(data);
    } catch (err) {
      console.warn('API fetchLabourers failed, loading sample/local data:', err);
      const savedLabourers = localStorage.getItem('labourers');
      if (savedLabourers) {
        setLabourers(JSON.parse(savedLabourers));
      }
    }
  }, []);

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      await Promise.all([fetchJobs(), fetchLabourers()]);
      setLoading(false);
    };
    initData();
  }, [fetchJobs, fetchLabourers]);

  const addJob = async (jobData) => {
    try {
      const newJob = await api.createJob(jobData);
      setJobs(prev => [newJob, ...prev]);
      return newJob;
    } catch (err) {
      const fallbackJob = {
        ...jobData,
        id: Date.now().toString(),
        postedAt: new Date().toISOString(),
        status: 'open'
      };
      setJobs(prev => [fallbackJob, ...prev]);
      localStorage.setItem('jobs', JSON.stringify([fallbackJob, ...jobs]));
      return fallbackJob;
    }
  };

  const assignJob = async (jobId, labourerId, labourerName) => {
    try {
      const updatedJob = await api.assignJob(jobId, labourerId, labourerName);
      setJobs(prev => prev.map(j => j.id === jobId ? updatedJob : j));
    } catch (err) {
      setJobs(prev => prev.map(j => 
        j.id === jobId ? { ...j, status: 'assigned', assignedTo: labourerId, assignedLabourerName: labourerName } : j
      ));
    }
  };

  const updateJobStatus = async (jobId, status) => {
    try {
      const updatedJob = await api.updateJobStatus(jobId, status);
      setJobs(prev => prev.map(j => j.id === jobId ? updatedJob : j));
      fetchLabourers(); // Refresh worker stats if job completed
    } catch (err) {
      setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status } : j));
    }
  };

  const applyForJob = async (jobId, labourerData) => {
    try {
      await api.applyForJob(jobId, labourerData);
      await fetchJobs();
      return true;
    } catch (err) {
      alert(err.message || 'Failed to apply');
      return false;
    }
  };

  const addReview = async (reviewData) => {
    try {
      await api.createReview(reviewData);
      await Promise.all([fetchJobs(), fetchLabourers()]);
      return true;
    } catch (err) {
      console.error('Failed to add review:', err);
      return false;
    }
  };

  const getJobsByCustomer = (customerId) => {
    return jobs.filter(job => job.customerId === customerId);
  };

  const getJobsBySkill = (skill) => {
    return jobs.filter(job => job.skillRequired?.toLowerCase() === skill?.toLowerCase() && job.status === 'open');
  };

  const getJobsByLocation = (location) => {
    return jobs.filter(job => job.location?.toLowerCase().includes(location?.toLowerCase()));
  };

  const getLabourersBySkill = (skill) => {
    return labourers.filter(labourer => 
      labourer.skills?.includes(skill) && labourer.available
    );
  };

  const getLabourersByLocation = (location) => {
    return labourers.filter(labourer => 
      labourer.location?.toLowerCase().includes(location?.toLowerCase()) && labourer.available
    );
  };

  const updateLabourerAvailability = async (labourerId, available) => {
    try {
      await api.toggleAvailability(labourerId, available);
      setLabourers(prev => prev.map(l => l.id === labourerId ? { ...l, available } : l));
    } catch (err) {
      setLabourers(prev => prev.map(l => l.id === labourerId ? { ...l, available } : l));
    }
  };

  return (
    <DataContext.Provider value={{
      jobs,
      labourers,
      loading,
      refreshData: () => Promise.all([fetchJobs(), fetchLabourers()]),
      addJob,
      assignJob,
      updateJobStatus,
      applyForJob,
      addReview,
      getJobsByCustomer,
      getJobsBySkill,
      getJobsByLocation,
      getLabourersBySkill,
      getLabourersByLocation,
      updateLabourerAvailability
    }}>
      {children}
    </DataContext.Provider>
  );
};