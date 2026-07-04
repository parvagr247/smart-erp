import axiosClient from '@shared/api/axios-client';

export const inventoryService = {
  // Items
  getItems: async (params) => {
    const res = await axiosClient.get('/inventory/items', { params });
    return res.data;
  },
  getItem: async (id) => {
    const res = await axiosClient.get(`/inventory/items/${id}`);
    return res.data;
  },
  createItem: async (data) => {
    const res = await axiosClient.post('/inventory/items', data);
    return res.data;
  },
  updateItem: async (id, data) => {
    const res = await axiosClient.put(`/inventory/items/${id}`, data);
    return res.data;
  },
  deleteItem: async (id) => {
    const res = await axiosClient.delete(`/inventory/items/${id}`);
    return res.data;
  },
  getSummary: async () => {
    const res = await axiosClient.get('/inventory/items/summary');
    return res.data;
  },

  // Brands
  getBrands: async () => {
    const res = await axiosClient.get('/inventory/brands');
    return res.data;
  },
  createBrand: async (data) => {
    const res = await axiosClient.post('/inventory/brands', data);
    return res.data;
  },
  deleteBrand: async (id) => {
    const res = await axiosClient.delete(`/inventory/brands/${id}`);
    return res.data;
  },

  // Manufacturers
  getManufacturers: async () => {
    const res = await axiosClient.get('/inventory/manufacturers');
    return res.data;
  },
  createManufacturer: async (data) => {
    const res = await axiosClient.post('/inventory/manufacturers', data);
    return res.data;
  },
  deleteManufacturer: async (id) => {
    const res = await axiosClient.delete(`/inventory/manufacturers/${id}`);
    return res.data;
  },

  // Categories
  getCategories: async () => {
    const res = await axiosClient.get('/inventory/categories');
    return res.data;
  },
  createCategory: async (data) => {
    const res = await axiosClient.post('/inventory/categories', data);
    return res.data;
  },
  deleteCategory: async (id) => {
    const res = await axiosClient.delete(`/inventory/categories/${id}`);
    return res.data;
  },

  // Units
  getUnits: async () => {
    const res = await axiosClient.get('/inventory/units');
    return res.data;
  },
  createUnit: async (data) => {
    const res = await axiosClient.post('/inventory/units', data);
    return res.data;
  },
  deleteUnit: async (id) => {
    const res = await axiosClient.delete(`/inventory/units/${id}`);
    return res.data;
  },

  // Tax Categories
  getTaxCategories: async () => {
    const res = await axiosClient.get('/inventory/tax-categories');
    return res.data;
  },
  createTaxCategory: async (data) => {
    const res = await axiosClient.post('/inventory/tax-categories', data);
    return res.data;
  },
  deleteTaxCategory: async (id) => {
    const res = await axiosClient.delete(`/inventory/tax-categories/${id}`);
    return res.data;
  },

  // HSN
  getHsn: async () => {
    const res = await axiosClient.get('/inventory/hsn');
    return res.data;
  },
  createHsn: async (data) => {
    const res = await axiosClient.post('/inventory/hsn', data);
    return res.data;
  },
  deleteHsn: async (id) => {
    const res = await axiosClient.delete(`/inventory/hsn/${id}`);
    return res.data;
  },

  // Warehouses
  getWarehouses: async () => {
    const res = await axiosClient.get('/inventory/warehouses');
    return res.data;
  },
  createWarehouse: async (data) => {
    const res = await axiosClient.post('/inventory/warehouses', data);
    return res.data;
  },
  deleteWarehouse: async (id) => {
    const res = await axiosClient.delete(`/inventory/warehouses/${id}`);
    return res.data;
  },

  // Stock Groups
  getGroups: async () => {
    const res = await axiosClient.get('/inventory/groups');
    return res.data;
  },
  createGroup: async (data) => {
    const res = await axiosClient.post('/inventory/groups', data);
    return res.data;
  },
  deleteGroup: async (id) => {
    const res = await axiosClient.delete(`/inventory/groups/${id}`);
    return res.data;
  },

  // Dashboard Stats
  getDashboardSummary: async () => {
    const res = await axiosClient.get('/dashboard/summary');
    return res.data;
  },
  getDashboardRecentActivity: async () => {
    const res = await axiosClient.get('/dashboard/recent-activity');
    return res.data;
  },
  searchGlobal: async (query) => {
    const res = await axiosClient.get('/dashboard/search', { params: { query } });
    return res.data;
  },

  // Purchase Vouchers
  getPurchases: async (params) => {
    const res = await axiosClient.get('/inventory/purchases', { params });
    return res.data;
  },
  getPurchase: async (id) => {
    const res = await axiosClient.get(`/inventory/purchases/${id}`);
    return res.data;
  },
  createPurchase: async (data) => {
    const res = await axiosClient.post('/inventory/purchases', data);
    return res.data;
  },
  updatePurchase: async (id, data) => {
    const res = await axiosClient.put(`/inventory/purchases/${id}`, data);
    return res.data;
  },
  updatePurchaseStatus: async (id, status) => {
    const res = await axiosClient.post(`/inventory/purchases/${id}/status`, null, { params: { status } });
    return res.data;
  },
  deletePurchase: async (id) => {
    const res = await axiosClient.delete(`/inventory/purchases/${id}`);
    return res.data;
  },

  // Sales Vouchers
  getSales: async (params) => {
    const res = await axiosClient.get('/inventory/sales', { params });
    return res.data;
  },
  getSale: async (id) => {
    const res = await axiosClient.get(`/inventory/sales/${id}`);
    return res.data;
  },
  createSale: async (data) => {
    const res = await axiosClient.post('/inventory/sales', data);
    return res.data;
  },
  updateSale: async (id, data) => {
    const res = await axiosClient.put(`/inventory/sales/${id}`, data);
    return res.data;
  },
  updateSaleStatus: async (id, status) => {
    const res = await axiosClient.patch(`/inventory/sales/${id}/status`, null, { params: { status } });
    return res.data;
  },
  deleteSale: async (id) => {
    const res = await axiosClient.delete(`/inventory/sales/${id}`);
    return res.data;
  },

  // Partners
  getPartners: async (params) => {
    const res = await axiosClient.get('/inventory/partners', { params });
    return res.data;
  },
  getPartner: async (id) => {
    const res = await axiosClient.get(`/inventory/partners/${id}`);
    return res.data;
  },
  createPartner: async (data) => {
    const res = await axiosClient.post('/inventory/partners', data);
    return res.data;
  },
  updatePartner: async (id, data) => {
    const res = await axiosClient.put(`/inventory/partners/${id}`, data);
    return res.data;
  },
  deletePartner: async (id) => {
    const res = await axiosClient.delete(`/inventory/partners/${id}`);
    return res.data;
  },
  updatePartnerStatus: async (id, status) => {
    const res = await axiosClient.patch(`/inventory/partners/${id}/status`, null, { params: { status } });
    return res.data;
  },
  getPartnerSummary: async () => {
    const res = await axiosClient.get('/inventory/partners/summary');
    return res.data;
  }
};
