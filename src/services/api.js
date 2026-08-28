const API_BASE_URL = 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || `API Error (${response.status})`);
    }

    return data;
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
}

export const api = {
  // Auth
  sendOtp: (phone) => request('/auth/send-otp', { method: 'POST', body: { phone } }),
  verifyOtp: (phone, otp) => request('/auth/verify-otp', { method: 'POST', body: { phone, otp } }),
  login: (phone, role) => request('/auth/login', { method: 'POST', body: { phone, role } }),
  register: (userData) => request('/auth/register', { method: 'POST', body: userData }),
  updateProfile: (id, updates) => request(`/auth/profile/${id}`, { method: 'PUT', body: updates }),

  // Jobs
  getJobs: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.customerId) params.append('customerId', filters.customerId);
    if (filters.skill) params.append('skill', filters.skill);
    if (filters.location) params.append('location', filters.location);
    if (filters.status) params.append('status', filters.status);
    const queryString = params.toString();
    return request(`/jobs${queryString ? `?${queryString}` : ''}`);
  },
  getJobById: (id) => request(`/jobs/${id}`),
  createJob: (jobData) => request('/jobs', { method: 'POST', body: jobData }),
  assignJob: (id, labourerId, labourerName) => 
    request(`/jobs/${id}/assign`, { method: 'POST', body: { labourerId, labourerName } }),
  updateJobStatus: (id, status) => 
    request(`/jobs/${id}/status`, { method: 'PUT', body: { status } }),
  applyForJob: (id, labourerData) => 
    request(`/jobs/${id}/apply`, { method: 'POST', body: labourerData }),
  getJobApplications: (id) => request(`/jobs/${id}/applications`),
  updateApplicationStatus: (appId, status) => 
    request(`/jobs/applications/${appId}/status`, { method: 'PUT', body: { status } }),

  // Labourers
  getLabourers: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.skill) params.append('skill', filters.skill);
    if (filters.location) params.append('location', filters.location);
    if (filters.available !== undefined) params.append('available', filters.available);
    const queryString = params.toString();
    return request(`/labourers${queryString ? `?${queryString}` : ''}`);
  },
  getLabourerById: (id) => request(`/labourers/${id}`),
  toggleAvailability: (id, available) => 
    request(`/labourers/${id}/availability`, { method: 'PUT', body: available }),

  // Reviews
  createReview: (reviewData) => request('/reviews', { method: 'POST', body: reviewData }),
  getUserReviews: (userId) => request(`/reviews/user/${userId}`)
};
