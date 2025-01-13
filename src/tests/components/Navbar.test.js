import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../../components/Navbar/Navbar';  // Adjust the import path as necessary
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Mocking useAuth hook
jest.mock('../../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// Mocking the useNavigate hook
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('Navbar Component', () => {
  const mockLogout = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useAuth.mockReturnValue({ logout: mockLogout });
    useNavigate.mockReturnValue(mockNavigate);
  });

  test('renders the Login and Signup links', () => {
    render(
      <Router>
        <Navbar />
      </Router>
    );

    // Check if Login and Signup links are rendered
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Signup')).toBeInTheDocument();
  });

  test('calls logout function when Logout is clicked', () => {
    render(
      <Router>
        <Navbar />
      </Router>
    );

    // Click the Logout link
    fireEvent.click(screen.getByText('Logout'));

    // Check if logout function is called
    expect(mockLogout).toHaveBeenCalled();
  });

  test('redirects to home page after logout', () => {
    render(
      <Router>
        <Navbar />
      </Router>
    );

    // Simulate click on Logout
    fireEvent.click(screen.getByText('Logout'));

    // Check if navigate function is called (assuming it redirects to "/")
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('renders Navbar component with correct elements', () => {
    render(
      <Router>
        <Navbar />
      </Router>
    );

    // Ensure the Navbar contains the expected logo
    expect(screen.getByText('TaskManager')).toBeInTheDocument();

    // Ensure the Navbar contains the links
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Signup')).toBeInTheDocument();
  });

  test('renders Navbar with logout when user is logged in', () => {
    useAuth.mockReturnValue({ logout: mockLogout, user: { name: 'John Doe' } });
    
    render(
      <Router>
        <Navbar />
      </Router>
    );

    expect(screen.getByText('Logout')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  test('renders Navbar with Login and Signup when user is logged out', () => {
    useAuth.mockReturnValue({ logout: mockLogout });
  
    render(
      <Router>
        <Navbar />
      </Router>
    );
  
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Signup')).toBeInTheDocument();
  });
});
