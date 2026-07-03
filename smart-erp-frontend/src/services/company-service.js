import { useState, useEffect } from 'react';
import axiosClient from '../api/axios-client';
import { useActiveCompany } from '../context/ActiveCompanyContext';

/* ==========================================================================
   1. API Operations
   ========================================================================== */
export async function fetchCompaniesList(page = 0, size = 10) {
  const response = await axiosClient.get(`/companies?page=${page}&size=${size}`);
  return response.data; // returns ApiResponse wrapper
}

export async function fetchCompanyById(id) {
  const response = await axiosClient.get(`/companies/${id}`);
  return response.data;
}

export async function createCompanyApi(data) {
  const response = await axiosClient.post('/companies', data);
  return response.data;
}

export async function updateCompanyApi(id, data) {
  const response = await axiosClient.put(`/companies/${id}`, data);
  return response.data;
}

export async function deleteCompanyApi(id) {
  const response = await axiosClient.delete(`/companies/${id}`);
  return response.data;
}


/* ==========================================================================
   2. Company Selection Hook (for CompanySelectionView)
   ========================================================================== */
export function useCompanySelection(onSelectSuccess) {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const { updateActiveCompany } = useActiveCompany();

  const loadCompanies = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchCompaniesList(page, 6);
      if (res.success && res.data) {
        setCompanies(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
      } else {
        setError(res.message || 'Failed to fetch companies.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load companies.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, [page]);

  const handleSelect = async (company) => {
    try {
      await updateActiveCompany(company);
      if (onSelectSuccess) onSelectSuccess(company);
    } catch (err) {
      setError('Failed to switch to the selected company.');
    }
  };

  return {
    companies,
    loading,
    error,
    page,
    setPage,
    totalPages,
    handleSelect,
    refreshList: loadCompanies,
  };
}


/* ==========================================================================
   3. Company Form Hook (for CreateCompany / EditCompany)
   ========================================================================== */
export function useCompanyForm(companyId, onSaveSuccess) {
  const [formData, setFormData] = useState({
    name: '',
    gstNumber: '',
    panNumber: '',
    financialYear: '2026-2027',
    address: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',
    phone: '',
    email: '',
    currency: 'INR',
    logo: '',
    version: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  // If companyId is provided (Edit mode), fetch initial values
  useEffect(() => {
    if (!companyId) return;

    const loadCompanyData = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetchCompanyById(companyId);
        if (res.success && res.data) {
          setFormData(res.data);
        } else {
          setError(res.message || 'Failed to load company details.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load company.');
      } finally {
        setLoading(false);
      }
    };

    loadCompanyData();
  }, [companyId]);

  const validateField = (name, value) => {
    let err = '';
    if (name === 'name') {
      if (!value) err = 'Company name is required.';
      else if (value.length < 2) err = 'Company name must be at least 2 characters.';
    } else if (name === 'gstNumber') {
      if (!value) err = 'GST Number is required.';
      else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(value)) {
        err = 'Invalid GST format (15-digit India GSTIN).';
      }
    } else if (name === 'panNumber') {
      if (!value) err = 'PAN Number is required.';
      else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value)) {
        err = 'Invalid PAN format (10-digit PAN).';
      }
    } else if (name === 'financialYear') {
      if (!value) err = 'Financial Year is required.';
      else if (!/^[0-9]{4}-[0-9]{4}$/.test(value)) {
        err = 'Invalid format (use YYYY-YYYY).';
      }
    } else if (name === 'state') {
      if (!value) err = 'State is required.';
    } else if (name === 'email' && value) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        err = 'Invalid email format.';
      }
    } else if (name === 'address' && value.length > 255) {
      err = 'Address cannot exceed 255 characters.';
    }
    setErrors(prev => ({ ...prev, [name]: err }));
  };

  const bindField = (fieldName) => ({
    value: formData[fieldName] || '',
    onChange: (e) => {
      const val = e.target.value;
      setFormData((prev) => ({ ...prev, [fieldName]: val }));
      validateField(fieldName, val);
    },
    disabled: loading,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Pre-flight client validation checks
    const hasErrors = Object.values(errors).some(val => val);
    if (!formData.name || !formData.gstNumber || !formData.panNumber || !formData.financialYear || !formData.state || hasErrors) {
      setError('Please fill in all required fields and resolve validation errors.');
      return;
    }

    setLoading(true);
    try {
      let res;
      if (companyId) {
        // Edit mode
        res = await updateCompanyApi(companyId, formData);
      } else {
        // Create mode
        res = await createCompanyApi(formData);
      }

      if (res.success && res.data) {
        if (onSaveSuccess) onSaveSuccess(res.data);
      } else {
        setError(res.message || 'Save failed.');
      }
    } catch (err) {
      const errorsList = err.response?.data?.errors;
      if (errorsList && Array.isArray(errorsList)) {
        setError(errorsList.join(', '));
      } else {
        setError(err.response?.data?.message || 'An error occurred while saving.');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    errors,
    handleSubmit,
    nameBind: bindField('name'),
    gstBind: bindField('gstNumber'),
    panBind: bindField('panNumber'),
    fyBind: bindField('financialYear'),
    addressBind: bindField('address'),
    cityBind: bindField('city'),
    stateBind: bindField('state'),
    countryBind: bindField('country'),
    pincodeBind: bindField('pincode'),
    phoneBind: bindField('phone'),
    emailBind: bindField('email'),
    currencyBind: bindField('currency'),
    logoBind: bindField('logo'),
  };
}


/* ==========================================================================
   4. Company Details Hook (for CompanyDetailsView)
   ========================================================================== */
export function useCompanyDetails(companyId, onDeleteSuccess) {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  const loadCompanyDetails = async () => {
    if (!companyId) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetchCompanyById(companyId);
      if (res.success && res.data) {
        setCompany(res.data);
      } else {
        setError(res.message || 'Failed to fetch details.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanyDetails();
  }, [companyId]);

  const handleDelete = async () => {
    if (!companyId) return;
    setDeleting(true);
    setError('');
    try {
      const res = await deleteCompanyApi(companyId);
      if (res.success) {
        if (onDeleteSuccess) onDeleteSuccess();
      } else {
        setError(res.message || 'Deletion failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete company.');
    } finally {
      setDeleting(false);
    }
  };

  return {
    company,
    loading,
    error,
    deleting,
    handleDelete,
    refreshDetails: loadCompanyDetails,
  };
}
