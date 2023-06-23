import axios from 'axios';
import queryString from 'query-string';
import { VendorProfileInterface, VendorProfileGetQueryInterface } from 'interfaces/vendor-profile';
import { GetQueryInterface } from '../../interfaces';

export const getVendorProfiles = async (query?: VendorProfileGetQueryInterface) => {
  const response = await axios.get(`/api/vendor-profiles${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createVendorProfile = async (vendorProfile: VendorProfileInterface) => {
  const response = await axios.post('/api/vendor-profiles', vendorProfile);
  return response.data;
};

export const updateVendorProfileById = async (id: string, vendorProfile: VendorProfileInterface) => {
  const response = await axios.put(`/api/vendor-profiles/${id}`, vendorProfile);
  return response.data;
};

export const getVendorProfileById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/vendor-profiles/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteVendorProfileById = async (id: string) => {
  const response = await axios.delete(`/api/vendor-profiles/${id}`);
  return response.data;
};
