import { useState, useEffect } from 'react';
import axiosClient from '@shared/api/axios-client';

/* ==========================================================================
   1. Central Session & Theme Hook (for App.jsx)
   ========================================================================== */
export function useAuth() {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [view, setView] = useState(() => localStorage.getItem('token') ? 'dashboard' : 'login');
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Theme setup
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      updateTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      updateTheme(prefersDark ? 'dark' : 'light');
    }

    // Session setup
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        setView('dashboard');
      } catch (err) {
        handleLogout();
      }
    }

    // Listen to global auth-expired event (from axios response interceptor)
    const handleAuthExpired = () => {
      handleLogout();
    };

    window.addEventListener('auth-expired', handleAuthExpired);
    return () => {
      window.removeEventListener('auth-expired', handleAuthExpired);
    };
  }, []);

  const updateTheme = (newTheme) => {
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  };

  const toggleTheme = () => {
    updateTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleLoginSuccess = (userData, jwtToken) => {
    localStorage.setItem('token', jwtToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(jwtToken);
    setUser(userData);
    setView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken('');
    setUser(null);
    setView('login');
  };

  return {
    view,
    setView,
    user,
    token,
    theme,
    toggleTheme,
    handleLoginSuccess,
    handleLogout,
  };
}

/* ==========================================================================
   2. Login Form Hook (for LoginView.jsx)
   ========================================================================== */
export function useLoginForm(onLoginSuccess) {
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

    // Pre-flight checks
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

/* ==========================================================================
   3. Register Form Hook (for RegisterView.jsx)
   ========================================================================== */
export function useRegisterForm(onRegisterSuccess) {
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

    // Pre-flight checks
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

/* ==========================================================================
   4. Dashboard Hook (for DashboardView.jsx)
   ========================================================================== */
export function useDashboard(user, token) {
  const [copied, setCopied] = useState(false);

  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'U';

  const roleName = user?.role
    ? user.role.replace('_', ' ').toLowerCase()
    : 'User';

  const createdDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleString()
    : 'N/A';

  const handleCopyToken = () => {
    navigator.clipboard.writeText(`Bearer ${token}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return {
    initials,
    roleName,
    createdDate,
    copied,
    handleCopyToken,
  };
}
