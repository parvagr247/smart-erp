import { useState, useEffect } from 'react';
import { useAuth } from '@shared/context/AuthContext';
import { useCompanySelection, deleteCompanyApi } from '../../services/company.service';

export function useCompanySelectionViewData(props) {
  const { user, theme, toggleTheme, handleLogout } = useAuth();
  const {
    companies,
    loading,
    error,
    page,
    setPage,
    totalPages,
    handleSelect,
    refreshList,
  } = useCompanySelection(props.onSelectSuccess);

  const [deleteModal, setDeleteModal] = useState({ isOpen: false, company: null });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const triggerDeleteConfirm = (company) => {
    setDeleteError('');
    setDeleteModal({ isOpen: true, company });
  };

  const executeDelete = async () => {
    if (!deleteModal.company) return;
    setDeleteLoading(true);
    setDeleteError('');
    try {
      const res = await deleteCompanyApi(deleteModal.company.id);
      if (res.success) {
        setDeleteModal({ isOpen: false, company: null });
        refreshList();
      } else {
        setDeleteError(res.message || 'Deletion failed.');
      }
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Failed to delete company.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(p => p[0]).join('').toUpperCase().substring(0, 2);
  };

  return {
    user,
    theme,
    toggleTheme,
    handleLogout,
    companies,
    loading,
    error,
    page,
    setPage,
    totalPages,
    handleSelect,
    deleteModal,
    setDeleteModal,
    deleteLoading,
    deleteError,
    executeDelete,
    triggerDeleteConfirm,
    currentTime,
    getInitials
  };
}
