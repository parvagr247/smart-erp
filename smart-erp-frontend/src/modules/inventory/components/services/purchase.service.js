import axiosClient from '@shared/api/axios-client';

export const fetchPurchasesList = async (params) => {
  const response = await axiosClient.get('/inventory/purchases', { params });
  return response.data;
};

export const fetchPurchaseById = async (id) => {
  const response = await axiosClient.get(`/inventory/purchases/${id}`);
  return response.data;
};

export const createPurchaseApi = async (data) => {
  const response = await axiosClient.post('/inventory/purchases', data);
  return response.data;
};

export const updatePurchaseApi = async (id, data) => {
  const response = await axiosClient.put(`/inventory/purchases/${id}`, data);
  return response.data;
};

export const updatePurchaseStatusApi = async (id, status) => {
  const response = await axiosClient.post(`/inventory/purchases/${id}/status`, null, {
    params: { status }
  });
  return response.data;
};

export const deletePurchaseApi = async (id) => {
  const response = await axiosClient.delete(`/inventory/purchases/${id}`);
  return response.data;
};
