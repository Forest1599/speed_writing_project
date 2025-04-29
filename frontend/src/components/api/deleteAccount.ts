import api from "./api";

// Delete ccount request
const deleteAccount = async () => {
  const response = await api.delete('/api/user/delete-account/');
  return response.data;
};

export default deleteAccount;