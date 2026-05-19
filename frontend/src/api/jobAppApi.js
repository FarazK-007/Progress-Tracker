import axios from 'axios';
import API_BASE_URL from './config';

const API_URL = `${API_BASE_URL}/jobapps/`;

export const fetchJobApps = () => axios.get(API_URL);
export const createJobApp = (data) => axios.post(API_URL, data);
export const updateJobApp = (id, data) => axios.put(`${API_URL}${id}`, data);
export const deleteJobApp = (id) => axios.delete(`${API_URL}${id}`);
