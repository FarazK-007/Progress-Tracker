import axios from 'axios';
import API_BASE_URL from './config';

const API_URL = `${API_BASE_URL}/milestones/`;

export const fetchMilestones = () => axios.get(API_URL);
export const createMilestone = (data) => axios.post(API_URL, data);
export const updateMilestone = (id, data) => axios.put(`${API_URL}${id}`, data);
export const deleteMilestone = (id) => axios.delete(`${API_URL}${id}`);
