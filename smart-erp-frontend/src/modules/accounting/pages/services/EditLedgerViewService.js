import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchGroupsList, fetchLedgerById, updateLedgerApi } from '@modules/accounting/services/accounting.service';

export function useEditLedgerViewData() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [groups, setGroups] = useState([]);
  const [formData, setFormData] = useState({
    name: '', groupId: '', openingBalance: 0, balanceType: 'DEBIT',
    gstApplicable: false, gstNumber: '', pan: '', email: '', phone: '', address: '', isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => { 
    fetchGroupsList().then(res => setGroups(res.data || [])); 
  }, []);

  useEffect(() => {
    if (!id) return;
    const loadLedger = async () => {
      setLoading(true);
      try {
        const res = await fetchLedgerById(id);
        if (res.success) setFormData(res.data);
      } catch (err) {
        setError('Failed to load ledger.');
      } finally {
        setLoading(false);
      }
    };
    loadLedger();
  }, [id]);

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
      const res = await updateLedgerApi(id, payload);
      if (res.success) {
        navigate('/accounting/ledgers');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update ledger.');
    } finally {
      setLoading(false);
    }
  };

  return {
    navigate,
    groups,
    loading,
    error,
    errors,
    bind,
    handleSubmit
  };
}
