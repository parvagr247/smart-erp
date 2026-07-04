import { useState, useEffect } from 'react';
import { inventoryService } from '../../inventory.service';

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
        const res = await inventoryService.getPartner(partnerId);
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
        res = await inventoryService.updatePartner(partnerId, formData);
      } else {
        res = await inventoryService.createPartner(formData);
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

export function usePartnerFormViewData(props) {
  const { formData, setFormData, error, loading, handleChange, handleCustomChange, handleSubmit, onCancel } = props;

  const addAddress = () => {
    setFormData(prev => ({
      ...prev,
      addresses: [...prev.addresses, { addressType: 'BILLING', addressLine1: '', addressLine2: '', city: '', state: '', country: 'India', pincode: '' }]
    }));
  };

  const removeAddress = (index) => {
    setFormData(prev => ({
      ...prev,
      addresses: prev.addresses.filter((_, i) => i !== index)
    }));
  };

  const handleAddressChange = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.addresses];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, addresses: updated };
    });
  };

  const addContact = () => {
    setFormData(prev => ({
      ...prev,
      contacts: [...prev.contacts, { contactName: '', designation: '', email: '', phone: '', mobile: '', isPrimary: prev.contacts.length === 0 }]
    }));
  };

  const removeContact = (index) => {
    setFormData(prev => ({
      ...prev,
      contacts: prev.contacts.filter((_, i) => i !== index)
    }));
  };

  const handleContactChange = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.contacts];
      if (field === 'isPrimary' && value === true) {
        updated.forEach((c, idx) => {
          updated[idx] = { ...c, isPrimary: idx === index };
        });
      } else {
        updated[index] = { ...updated[index], [field]: value };
      }
      return { ...prev, contacts: updated };
    });
  };

  return {
    formData,
    error,
    loading,
    handleChange,
    handleCustomChange,
    handleSubmit,
    onCancel,
    addAddress,
    removeAddress,
    handleAddressChange,
    addContact,
    removeContact,
    handleContactChange
  };
}
