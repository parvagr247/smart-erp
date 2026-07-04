import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@shared/context/AuthContext';
import { useCompanyForm } from '../../administration.service';

export function useEditCompanyViewData(props) {
  const { id } = useParams();
  const { user, theme, toggleTheme, handleLogout } = useAuth();
  const formHooks = useCompanyForm(id || props.companyId, props.onSaveSuccess);
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
    handleLogout,
    formHooks,
    currentTime,
    getInitials
  };
}

