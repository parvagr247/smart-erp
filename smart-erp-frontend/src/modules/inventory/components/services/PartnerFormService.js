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
