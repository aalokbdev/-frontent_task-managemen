import React, { useState } from 'react';
import { apiSignup } from '../../services/api';
import './auth.css';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const response = await apiSignup(formData);
      setSuccessMessage('Signup successful! Please log in.');
    } catch (error) {
      setErrorMessage('Signup failed. Please try again.');
      console.error('Signup error:', error);
    }
  };

  return (
    <div className="signup-page">
      <h2>Signup</h2>
      <form className="signup-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Enter name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
         <select required name="role" onChange={handleChange}>
          <option value="User">User</option>
          <option value="Admin">Admin</option>
        </select>
        <button type="submit">Signup</button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
      </form>
    </div>
  );
};


export default Signup;