import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../../pages/Auth/Login'; // Adjust the import path as necessary
import '@testing-library/jest-dom';
import { useAuth } from '../../context/AuthContext';

// Mocking the useAuth hook
jest.mock('../../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('Login Component', () => {
  const mockLogin = jest.fn();

  beforeEach(() => {
    useAuth.mockReturnValue({ login: mockLogin });
  });

  test('renders the Login form', () => {
    render(<Login />);

    // Ensure email and password input fields are rendered
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();

    // Ensure the Login button is rendered
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  test('updates email and password fields on change', () => {
    render(<Login />);

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');

    // Simulate typing into the email and password input fields
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Ensure the email and password values are updated
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('calls login function when form is submitted with valid credentials', async () => {
    render(<Login />);

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByText('Login');

    // Simulate entering valid email and password
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Simulate form submission
    fireEvent.click(submitButton);

    // Wait for login function to be called
    await waitFor(() => expect(mockLogin).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    }));
  });

  test('displays error message when login fails', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Invalid credentials'));

    render(<Login />);

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByText('Login');

    // Simulate entering invalid email and password
    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

    // Simulate form submission
    fireEvent.click(submitButton);

    // Wait for the error message to be displayed
    await screen.findByText('Invalid username or password. Please try again.');
});

  test('does not display error message when login is successful', async () => {
    mockLogin.mockResolvedValueOnce({});

    render(<Login />);

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByText('Login');

    // Simulate entering valid email and password
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Simulate form submission
    fireEvent.click(submitButton);

    // Wait for login function to be called and error message to not be present
    await waitFor(() => expect(screen.queryByText('Invalid username or password. Please try again.')).not.toBeInTheDocument());
  });

  test('does not allow submission if email or password is empty', () => {
    render(<Login />);

    const submitButton = screen.getByText('Login');
    
    // Try to submit without filling in the fields
    fireEvent.click(submitButton);

    // Ensure the login function was not called
    expect(mockLogin).not.toHaveBeenCalled();
  });
});
