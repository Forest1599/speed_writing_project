import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants/constants';
import api from '../components/api/api';

/**
 * Custom hook for handling authentication form logic (login and registration)
 */
export const useAuthForm = (route: string, method: string) => {
  // Form fields
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  // Form states
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  /**
   * Handles form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.post(route, { username, password });

      if (method === 'login') {
        // Save tokens and redirect to home page
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate('/');
      } else {
        // Registration success, redirect to login with success message
        localStorage.setItem('successMessage', 'Account created successfully! Please log in.');
        navigate('/login');
      }
      
    } catch (err: any) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Parses API error responses into readable messages
   */
  const parseApiError = (error: any): string => {
    if (error.response) {
      try {
        const responseData = JSON.parse(error.request.responseText);

        if (responseData.detail) {
          return responseData.detail;
        } else if (typeof responseData === 'object') {
          const firstKey = Object.keys(responseData)[0];
          return responseData[firstKey][0];
        }
      } catch (parseError) {
        return 'An unexpected error occurred.';
      }
    }
    return 'Network error. Please try again.';
  };

  // Return hook values
  return {
    username,
    setUsername,
    password,
    setPassword,
    loading,
    error,
    handleSubmit,
  };
};