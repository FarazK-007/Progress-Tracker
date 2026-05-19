import axios from 'axios';
import API_BASE_URL from './config';

const API_URL = `${API_BASE_URL}/studylogs/`;

export const fetchStudyLogs = () => axios.get(API_URL);
export const createStudyLog = (data) => axios.post(API_URL, data);
export const updateStudyLog = (id, data) => axios.put(`${API_URL}${id}`, data);
export const deleteStudyLog = (id) => axios.delete(`${API_URL}${id}`);
