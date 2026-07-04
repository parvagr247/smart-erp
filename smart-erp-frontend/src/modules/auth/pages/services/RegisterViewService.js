import { useState } from 'react';
import axiosClient from '@shared/api/axios-client';

export function useRegisterViewData(onRegisterSuccess) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('ACCOUNTANT');
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateField = (name, value) => {
    let err = '';
    if (name === 'fullName') {
      if (!value) err = 'Full name is required.';
      else if (value.length < 2) err = 'Full name must be at least 2 characters.';
    } else if (name === 'email') {
      if (!value) err = 'Email is required.';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) err = 'Invalid email format.';
    } else if (name === 'password') {
      if (!value) err = 'Password is required.';
      else if (value.length < 6) err = 'Password must be at least 6 characters.';
    }
    setErrors(prev => ({ ...prev, [name]: err }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName || !email || !password || !role || errors.fullName || errors.email || errors.password) {
      setError('Please resolve all validation errors before submitting.');
      return;
    }

    setLoading(true);

    try {
      const response = await axiosClient.post('/auth/register', {
        fullName,
        email,
        password,
        role,
      });
      const { token, user } = response.data;
      onRegisterSuccess(user, token);
    } catch (err) {
      const errorsList = err.response?.data?.errors;
      if (errorsList && Array.isArray(errorsList)) {
        setError(errorsList.join(', '));
      } else {
        const errMsg = err.response?.data?.message || 'Registration failed. Try again.';
        setError(errMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const nameBind = {
    value: fullName,
    onChange: (e) => {
      const val = e.target.value;
      setFullName(val);
      validateField('fullName', val);
    },
    disabled: loading,
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

  const roleBind = {
    value: role,
    onChange: (e) => setRole(e.target.value),
    disabled: loading,
  };

  return {
    error,
    errors,
    loading,
    handleSubmit,
    nameBind,
    emailBind,
    passwordBind,
    roleBind,
  };
}
