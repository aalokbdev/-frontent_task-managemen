import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Signup from '../../components/Signup'; // Adjust the import path as necessary
import '@testing-library/jest-dom';
import { apiSignup } from '../../services/api';

// Mocking the apiSignup function
jest.mock('../../services/api', () => ({
  apiSignup: jest.fn(),
}));

describe('Signup Component', () => {
  beforeEach(() => {
    apiSignup.mockReset();
  });

  test('renders the Signup form', () => {
    render(<Signup />);

    // Ensure the name, email, password, and role input fields are rendered
    expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter role')).toBeInTheDocument();

    // Ensure the Signup button is rendered
    expect(screen.getByText('Signup')).toBeInTheDocument();
  });

  test('updates form fields correctly on change', () => {
    render(<Signup />);

    const nameInput = screen.getByPlaceholderText('Enter name');
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const roleInput = screen.getByPlaceholderText('Enter role');

    // Simulate typing into the input fields
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'johndoe@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(roleInput, { target: { value: 'User' } });

    // Ensure the input fields' values are updated correctly
    expect(nameInput.value).toBe('John Doe');
    expect(emailInput.value).toBe('johndoe@example.com');
    expect(passwordInput.value).toBe('password123');
    expect(roleInput.value).toBe('User');
  });

  test('calls apiSignup function with form data when form is submitted successfully', async () => {
    apiSignup.mockResolvedValueOnce({});

    render(<Signup />);

    const nameInput = screen.getByPlaceholderText('Enter name');
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const roleInput = screen.getByPlaceholderText('Enter role');
    const submitButton = screen.getByText('Signup');

    // Simulate entering valid form data
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'johndoe@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(roleInput, { target: { value: 'User' } });

    // Simulate form submission
    fireEvent.click(submitButton);

    // Wait for apiSignup function to be called with the correct form data
    await waitFor(() =>
      expect(apiSignup).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password123',
        role: 'User',
      })
    );
  });

  test('displays success message on successful signup', async () => {
    apiSignup.mockResolvedValueOnce({});

    render(<Signup />);

    const nameInput = screen.getByPlaceholderText('Enter name');
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const roleInput = screen.getByPlaceholderText('Enter role');
    const submitButton = screen.getByText('Signup');

    // Simulate entering valid form data
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'johndoe@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(roleInput, { target: { value: 'User' } });

    // Simulate form submission
    fireEvent.click(submitButton);

    // Wait for success message to appear
    // await waitFor(() =>
    // //   expect(screen.getByText('Signup successful! Please log in.')).toBeInTheDocument()
    // );

    await screen.findByText('Signup successful! Please log in.');

  });

  test('displays error message on failed signup', async () => {
    apiSignup.mockRejectedValueOnce(new Error('Signup failed'));

    render(<Signup />);

    const nameInput = screen.getByPlaceholderText('Enter name');
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const roleInput = screen.getByPlaceholderText('Enter role');
    const submitButton = screen.getByText('Signup');

    // Simulate entering invalid form data
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'johndoe@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(roleInput, { target: { value: 'User' } });

    // Simulate form submission
    fireEvent.click(submitButton);

    // Wait for the error message to appear
    // await waitFor(() =>
    //   expect(screen.getByText('Signup failed. Please try again.')).toBeInTheDocument()
    // );

    await screen.findByText('Signup failed. Please try again.');

  });

  test('does not submit if any form field is empty', () => {
    render(<Signup />);

    const submitButton = screen.getByText('Signup');

    // Try to submit with empty fields
    fireEvent.click(submitButton);

    // Ensure the apiSignup function is not called
    expect(apiSignup).not.toHaveBeenCalled();
  });
});
