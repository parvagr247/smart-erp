import axios from 'axios';

const API_BASE = 'http://localhost:9521/api/v1/inventory';

// Interceptor helper to append active company context
const getHeaders = () => {
  const companyId = localStorage.getItem('companyId');
  return {
    headers: {
      'X-Company-ID': companyId || '',
      'Content-Type': 'application/json'
    }
  };
};

export const inventoryService = {
  // Items
  getItems: async (params) => {
    const res = await axios.get(`${API_BASE}/items`, {
      ...getHeaders(),
      params
    });
    return res.data;
  },
  getItem: async (id) => {
    const res = await axios.get(`${API_BASE}/items/${id}`, getHeaders());
    return res.data;
  },
  createItem: async (data) => {
    const res = await axios.post(`${API_BASE}/items`, data, getHeaders());
    return res.data;
  },
  updateItem: async (id, data) => {
    const res = await axios.put(`${API_BASE}/items/${id}`, data, getHeaders());
    return res.data;
  },
  deleteItem: async (id) => {
    const res = await axios.delete(`${API_BASE}/items/${id}`, getHeaders());
    return res.data;
  },
  getSummary: async () => {
    const res = await axios.get(`${API_BASE}/items/summary`, getHeaders());
    return res.data;
  },

  // Brands
  getBrands: async () => {
    const res = await axios.get(`${API_BASE}/brands`, getHeaders());
    return res.data;
  },
  createBrand: async (data) => {
    const res = await axios.post(`${API_BASE}/brands`, data, getHeaders());
    return res.data;
  },
  deleteBrand: async (id) => {
    const res = await axios.delete(`${API_BASE}/brands/${id}`, getHeaders());
    return res.data;
  },

  // Manufacturers
  getManufacturers: async () => {
    const res = await axios.get(`${API_BASE}/manufacturers`, getHeaders());
    return res.data;
  },
  createManufacturer: async (data) => {
    const res = await axios.post(`${API_BASE}/manufacturers`, data, getHeaders());
    return res.data;
  },
  deleteManufacturer: async (id) => {
    const res = await axios.delete(`${API_BASE}/manufacturers/${id}`, getHeaders());
    return res.data;
  },

  // Categories
  getCategories: async () => {
    const res = await axios.get(`${API_BASE}/categories`, getHeaders());
    return res.data;
  },
  createCategory: async (data) => {
    const res = await axios.post(`${API_BASE}/categories`, data, getHeaders());
    return res.data;
  },
  deleteCategory: async (id) => {
    const res = await axios.delete(`${API_BASE}/categories/${id}`, getHeaders());
    return res.data;
  },

  // Units
  getUnits: async () => {
    const res = await axios.get(`${API_BASE}/units`, getHeaders());
    return res.data;
  },
  createUnit: async (data) => {
    const res = await axios.post(`${API_BASE}/units`, data, getHeaders());
    return res.data;
  },
  deleteUnit: async (id) => {
    const res = await axios.delete(`${API_BASE}/units/${id}`, getHeaders());
    return res.data;
  },

  // Tax Categories
  getTaxCategories: async () => {
    const res = await axios.get(`${API_BASE}/tax-categories`, getHeaders());
    return res.data;
  },
  createTaxCategory: async (data) => {
    const res = await axios.post(`${API_BASE}/tax-categories`, data, getHeaders());
    return res.data;
  },
  deleteTaxCategory: async (id) => {
    const res = await axios.delete(`${API_BASE}/tax-categories/${id}`, getHeaders());
    return res.data;
  },

  // HSN
  getHsn: async () => {
    const res = await axios.get(`${API_BASE}/hsn`, getHeaders());
    return res.data;
  },
  createHsn: async (data) => {
    const res = await axios.post(`${API_BASE}/hsn`, data, getHeaders());
    return res.data;
  },
  deleteHsn: async (id) => {
    const res = await axios.delete(`${API_BASE}/hsn/${id}`, getHeaders());
    return res.data;
  },

  // Warehouses
  getWarehouses: async () => {
    const res = await axios.get(`${API_BASE}/warehouses`, getHeaders());
    return res.data;
  },
  createWarehouse: async (data) => {
    const res = await axios.post(`${API_BASE}/warehouses`, data, getHeaders());
    return res.data;
  },
  deleteWarehouse: async (id) => {
    const res = await axios.delete(`${API_BASE}/warehouses/${id}`, getHeaders());
    return res.data;
  },

  // Stock Groups
  getGroups: async () => {
    const res = await axios.get(`${API_BASE}/groups`, getHeaders());
    return res.data;
  },
  createGroup: async (data) => {
    const res = await axios.post(`${API_BASE}/groups`, data, getHeaders());
    return res.data;
  },
  deleteGroup: async (id) => {
    const res = await axios.delete(`${API_BASE}/groups/${id}`, getHeaders());
    return res.data;
  }
};
