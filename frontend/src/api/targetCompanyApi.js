import axios from 'axios';
import API_BASE_URL from './config';

const API_URL = `${API_BASE_URL}/targetcompanies/`;

export const fetchTargetCompanies = () => axios.get(API_URL);
export const createTargetCompany = (data) => axios.post(API_URL, data);
export const updateTargetCompany = (id, data) => axios.put(API_URL + id, data);
export const deleteTargetCompany = (id) => axios.delete(API_URL + id);
