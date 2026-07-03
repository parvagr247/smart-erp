import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosClient from '../api/axios-client';

const ActiveCompanyContext = createContext(null);

export function ActiveCompanyProvider({ children }) {
  const [activeCompany, setActiveCompanyState] = useState(() => {
    try {
      const saved = localStorage.getItem('activeCompany');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const updateActiveCompany = async (company) => {
    if (!company) {
      clearActiveCompany();
      return;
    }
    
    try {
      // Notify backend of the switch
      await axiosClient.post(`/companies/${company.id}/switch`);
    } catch (err) {
      console.error('Failed to notify backend of company switch:', err);
    }

    localStorage.setItem('activeCompany', JSON.stringify(company));
    localStorage.setItem('activeCompanyId', company.id);
    setActiveCompanyState(company);
  };

  const clearActiveCompany = () => {
    localStorage.removeItem('activeCompany');
    localStorage.removeItem('activeCompanyId');
    setActiveCompanyState(null);
  };

  return (
    <ActiveCompanyContext.Provider value={{ activeCompany, updateActiveCompany, clearActiveCompany }}>
      {children}
    </ActiveCompanyContext.Provider>
  );
}

export function useActiveCompany() {
  const context = useContext(ActiveCompanyContext);
  if (!context) {
    throw new Error('useActiveCompany must be used within an ActiveCompanyProvider');
  }
  return context;
}
