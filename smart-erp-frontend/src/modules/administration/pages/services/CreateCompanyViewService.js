import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@shared/context/AuthContext';
import { useCompanyForm } from '../../administration.service';

export function useCreateCompanyViewData(props) {
  const navigate = useNavigate();
  const { user, theme, toggleTheme } = useAuth();
  const formHooks = useCompanyForm(null, props.onSaveSuccess);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(p => p[0]).join('').toUpperCase().substring(0, 2);
  };

  return {
    user,
    theme,
    toggleTheme,
    handleLogout: () => navigate('/logout'),
    formHooks,
    currentTime,
    getInitials
  };
}

