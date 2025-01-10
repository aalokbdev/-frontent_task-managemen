import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.REACT_APP_BASE_URL;
console.log('api base url',API_BASE_URL);

export const apiLogin = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}users/login`, credentials);
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

export const fetchTasks = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}tasks`, {
      headers: { Authorization: `Bearer ${Cookies.get('token')}` },
    });
    return response.data;
  } catch (error) {
    console.error('Fetching tasks failed:', error);
    throw error;
  }
};

export const createTask = async (taskData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}tasks`, taskData, {
      headers: { Authorization: `Bearer ${Cookies.get('token')}` },
    });
    return response.data;
  } catch (error) {
    console.error('Creating task failed:', error);
    throw error;
  }
};

export const updateTask = async (id, updates) => {
  try {
    const response = await axios.put(`${API_BASE_URL}tasks/${id}`, updates, {
      headers: { Authorization: `Bearer ${Cookies.get('token')}` },
    });
    return response.data;
  } catch (error) {
    console.error('Updating task failed:', error);
    throw error;
  }
};

export const deleteTask = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}tasks/${id}`, {
      headers: { Authorization: `Bearer ${Cookies.get('token')}` },
    });
    return response.data;
  } catch (error) {
    console.error('Deleting task failed:', error);
    throw error;
  }
};

export const apiSignup = async (formData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}users/register`, formData);
      return response.data;
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

export const fetchAllUsers = async() => {
  try {
    const response = await axios.get(`${API_BASE_URL}users`, {
      headers: { Authorization: `Bearer ${Cookies.get('token')}` },
    });
    return response.data;
  } catch (error) {
    console.error('Fetching tasks failed:', error);
    throw error;
  }
}


export const fetchUserTasks = async() => {
  try {
    const response = await axios.get(`${API_BASE_URL}tasks/user`, {
      headers: { Authorization: `Bearer ${Cookies.get('token')}` },
    });
    return response.data;
  } catch (error) {
    console.error('Fetching tasks failed:', error);
    throw error;
  }
}

