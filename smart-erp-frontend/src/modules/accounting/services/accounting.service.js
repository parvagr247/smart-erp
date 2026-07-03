import { useState, useEffect } from 'react';
import axiosClient from '@shared/api/axios-client';

/* ==========================================================================
   1. Account Groups API Calls
   ========================================================================== */
export const fetchGroupsList = async () => {
  const response = await axiosClient.get('/accounting/groups');
  return response.data;
};

export const createGroupApi = async (data) => {
  const response = await axiosClient.post('/accounting/groups', data);
  return response.data;
};

export const updateGroupApi = async (id, data) => {
  const response = await axiosClient.put(`/accounting/groups/${id}`, data);
  return response.data;
};

export const deleteGroupApi = async (id) => {
  const response = await axiosClient.delete(`/accounting/groups/${id}`);
  return response.data;
};

/* ==========================================================================
   2. Ledgers API Calls
   ========================================================================== */
export const fetchLedgersList = async (params) => {
  const response = await axiosClient.get('/accounting/ledgers', { params });
  return response.data;
};

export const fetchLedgerById = async (id) => {
  const response = await axiosClient.get(`/accounting/ledgers/${id}`);
  return response.data;
};

export const createLedgerApi = async (data) => {
  const response = await axiosClient.post('/accounting/ledgers', data);
  return response.data;
};

export const updateLedgerApi = async (id, data) => {
  const response = await axiosClient.put(`/accounting/ledgers/${id}`, data);
  return response.data;
};

export const deleteLedgerApi = async (id) => {
  const response = await axiosClient.delete(`/accounting/ledgers/${id}`);
  return response.data;
};

/* ==========================================================================
   3. Group Form State Hook
   ========================================================================== */
export function useGroupForm(groupId, onSaveSuccess) {
  const [formData, setFormData] = useState({ name: '', nature: 'ASSET', parentGroupId: '', description: '', isActive: true });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!groupId) return;
    const loadGroup = async () => {
      setLoading(true);
      try {
        const res = await axiosClient.get(`/accounting/groups/${groupId}`);
        if (res.data?.success) setFormData(res.data.data);
      } catch (err) {
        setError('Failed to load group details.');
      } finally {
        setLoading(false);
      }
    };
    loadGroup();
  }, [groupId]);

  const bind = (field) => ({
    value: formData[field] ?? '',
    onChange: (e) => {
      const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      setFormData(prev => ({ ...prev, [field]: val }));
      let err = '';
      if (field === 'name') {
        if (!val) err = 'Group name is required.';
        else if (val.length < 2) err = 'Group name must be at least 2 characters.';
      }
      setErrors(prev => ({ ...prev, [field]: err }));
    },
    disabled: loading
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.name) {
      setError('Please resolve all validation errors.');
      return;
    }
    setLoading(true);
    try {
      const payload = { ...formData, parentGroupId: formData.parentGroupId || null };
      const res = groupId ? await updateGroupApi(groupId, payload) : await createGroupApi(payload);
      if (res.success && onSaveSuccess) onSaveSuccess(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save group.');
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, errors, formData, setFormData, bind, handleSubmit };
}

/* ==========================================================================
   4. Ledger Form State Hook
   ========================================================================== */
export function useLedgerForm(ledgerId, onSaveSuccess) {
  const [formData, setFormData] = useState({
    name: '', groupId: '', openingBalance: 0, balanceType: 'DEBIT',
    gstApplicable: false, gstNumber: '', pan: '', email: '', phone: '', address: '', isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!ledgerId) return;
    const loadLedger = async () => {
      setLoading(true);
      try {
        const res = await fetchLedgerById(ledgerId);
        if (res.success) setFormData(res.data);
      } catch (err) {
        setError('Failed to load ledger.');
      } finally {
        setLoading(false);
      }
    };
    loadLedger();
  }, [ledgerId]);

  const bind = (field) => ({
    value: formData[field] ?? '',
    onChange: (e) => {
      const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      setFormData(prev => ({ ...prev, [field]: val }));
      let err = '';
      if (field === 'name') {
        if (!val) err = 'Ledger name is required.';
        else if (val.length < 2) err = 'Ledger name must be at least 2 characters.';
      } else if (field === 'groupId' && !val) {
        err = 'Account group is required.';
      } else if (field === 'openingBalance' && val > 0 && !formData.balanceType) {
        err = 'Balance type (DEBIT or CREDIT) is required.';
      } else if (field === 'gstNumber' && val) {
        if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(val)) {
          err = 'Invalid GST format (15-digit GSTIN).';
        }
      } else if (field === 'pan' && val) {
        if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(val)) {
          err = 'Invalid PAN format (10-digit PAN).';
        }
      }
      setErrors(prev => ({ ...prev, [field]: err }));
    },
    disabled: loading
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const hasErrors = Object.values(errors).some(val => val);
    if (!formData.name || !formData.groupId || hasErrors) {
      setError('Please resolve all validation errors before saving.');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...formData,
        openingBalance: Number(formData.openingBalance) || 0,
        gstNumber: formData.gstNumber || null,
        pan: formData.pan || null,
        email: formData.email || null,
        phone: formData.phone || null,
        address: formData.address || null
      };
      const res = ledgerId ? await updateLedgerApi(ledgerId, payload) : await createLedgerApi(payload);
      if (res.success && onSaveSuccess) onSaveSuccess(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save ledger.');
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, errors, formData, setFormData, bind, handleSubmit };
}

/* ==========================================================================
   4. Report Engine API Calls
   ========================================================================== */
export const fetchTrialBalance = async () => {
  const response = await axiosClient.get('/reports/trial-balance');
  return response.data;
};

export const fetchProfitLoss = async (params) => {
  const response = await axiosClient.get('/reports/profit-loss', { params });
  return response.data;
};

export const fetchBalanceSheet = async (params) => {
  const response = await axiosClient.get('/reports/balance-sheet', { params });
  return response.data;
};

export const fetchCashBankBook = async (params) => {
  const response = await axiosClient.get('/reports/cash-bank-book', { params });
  return response.data;
};

export const fetchOutstanding = async (params) => {
  const response = await axiosClient.get('/reports/outstanding', { params });
  return response.data;
};

export const fetchInventoryValuation = async () => {
  const response = await axiosClient.get('/reports/inventory-valuation');
  return response.data;
};

export const fetchStockRegister = async (params) => {
  const response = await axiosClient.get('/reports/stock-register', { params });
  return response.data;
};

export const fetchGstSummary = async (params) => {
  const response = await axiosClient.get('/reports/gst-summary', { params });
  return response.data;
};

export const fetchKpis = async () => {
  const response = await axiosClient.get('/reports/kpis');
  return response.data;
};
