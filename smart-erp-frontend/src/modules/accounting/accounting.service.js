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
   3. Report Engine API Calls
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
