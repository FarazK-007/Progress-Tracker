import axios from 'axios';
import API_BASE_URL from './config';

const API_URL = `${API_BASE_URL}/mockinterviews/`;

export const fetchMockInterviews = () => axios.get(API_URL);
export const createMockInterview = (data) => axios.post(API_URL, data);
export const updateMockInterview = (id, data) => axios.put(`${API_URL}${id}`, data);
export const deleteMockInterview = (id) => axios.delete(`${API_URL}${id}`);
