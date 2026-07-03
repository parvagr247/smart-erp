import { useState, useEffect } from 'react';
import axiosClient from '@shared/api/axios-client';

/* ==========================================================================
   1. Business Partner API Calls
   ========================================================================== */
export const fetchPartnersList = async (params) => {
  const response = await axiosClient.get('/inventory/partners', { params });
  return response.data;
};

export const fetchPartnerById = async (id) => {
  const response = await axiosClient.get(`/inventory/partners/${id}`);
  return response.data;
};

export const createPartnerApi = async (data) => {
  const response = await axiosClient.post('/inventory/partners', data);
  return response.data;
};

export const updatePartnerApi = async (id, data) => {
  const response = await axiosClient.put(`/inventory/partners/${id}`, data);
  return response.data;
};

export const deletePartnerApi = async (id) => {
  const response = await axiosClient.delete(`/inventory/partners/${id}`);
  return response.data;
};

export const updatePartnerStatusApi = async (id, status) => {
  const response = await axiosClient.patch(`/inventory/partners/${id}/status`, null, {
    params: { status }
  });
  return response.data;
};

export const fetchPartnerSummary = async () => {
  const response = await axiosClient.get('/inventory/partners/summary');
  return response.data;
};

/* ==========================================================================
   2. Partner Form State Hook
   ========================================================================== */
export function usePartnerForm(partnerId, onSaveSuccess) {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    type: 'CUSTOMER',
    gstNumber: '',
    pan: '',
    email: '',
    phone: '',
    mobile: '',
    website: '',
    creditLimit: '0.00',
    openingBalance: '0.00',
    balanceType: 'DEBIT',
    paymentTerms: '',
    status: 'ACTIVE',
    notes: '',
    isActive: true,
    addresses: [],
    contacts: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!partnerId) return;

    const loadPartner = async () => {
      setLoading(true);
      try {
        const res = await fetchPartnerById(partnerId);
        if (res.success && res.data) {
          setFormData({
            ...res.data,
            creditLimit: String(res.data.creditLimit || '0.00'),
            openingBalance: String(res.data.openingBalance || '0.00')
          });
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load business partner details.');
      } finally {
        setLoading(false);
      }
    };

    loadPartner();
  }, [partnerId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCustomChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      let res;
      if (partnerId) {
        res = await updatePartnerApi(partnerId, formData);
      } else {
        res = await createPartnerApi(formData);
      }

      if (res.success) {
        if (onSaveSuccess) onSaveSuccess(res.data);
      } else {
        setError(res.message || 'Operation failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server validation error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    loading,
    error,
    handleChange,
    handleCustomChange,
    handleSubmit
  };
}
