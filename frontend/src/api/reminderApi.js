import axios from 'axios';
import API_BASE_URL from './config';

const API_URL = `${API_BASE_URL}/reminders/`;

export const fetchReminders = () => axios.get(API_URL);
export const createReminder = (data) => axios.post(API_URL, data);
export const updateReminder = (id, data) => axios.put(`${API_URL}${id}`, data);
export const deleteReminder = (id) => axios.delete(`${API_URL}${id}`);
