import api from './api';

// Get profile stats request
const getProfileStats = async () => {
  const response = await api.get('/api/stats/');
  return response.data;
};

export default getProfileStats;