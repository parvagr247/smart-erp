import { useState } from 'react';
import axiosClient from '@shared/api/axios-client';

export function useLoginViewData(onLoginSuccess) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateField = (name, value) => {
    let err = '';
    if (name === 'email') {
      if (!value) err = 'Email is required.';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) err = 'Invalid email format.';
    } else if (name === 'password') {
      if (!value) err = 'Password is required.';
    }
    setErrors(prev => ({ ...prev, [name]: err }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password || errors.email || errors.password) {
      setError('Please resolve all validation errors before logging in.');
      return;
    }

    setLoading(true);
    try {
      const response = await axiosClient.post('/auth/login', { email, password });
      const { token, user } = response.data;
      onLoginSuccess(user, token);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const emailBind = {
    value: email,
    onChange: (e) => {
      const val = e.target.value;
      setEmail(val);
      validateField('email', val);
    },
    disabled: loading,
  };

  const passwordBind = {
    value: password,
    onChange: (e) => {
      const val = e.target.value;
      setPassword(val);
      validateField('password', val);
    },
    disabled: loading,
  };

  return {
    error,
    errors,
    loading,
    handleSubmit,
    emailBind,
    passwordBind,
  };
}
