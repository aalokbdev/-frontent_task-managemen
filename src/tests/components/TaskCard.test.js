import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskCard from '../../components/TaskCard/TaskCard'; // Adjust the import path as necessary
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';

// Mocking props
const task = {
  _id: '1',
  title: 'Test Task',
  status: 'Pending',
  deadline: '2025-01-13',
  description: 'This is a test task',
  assignedTo: { name: 'John Doe' },
};

const onUpdate = jest.fn();
const onDelete = jest.fn();
const handleShowUpdateModal = jest.fn();

describe('TaskCard Component', () => {
  test('renders TaskCard with task details', () => {
    render(<TaskCard task={task} onUpdate={onUpdate} onDelete={onDelete} isAdmin={false} handleShowUpdateModal={handleShowUpdateModal} />);

    // Check if the task details are rendered correctly
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Status: Pending')).toBeInTheDocument();
    expect(screen.getByText('Deadline: 2025-01-13')).toBeInTheDocument();
    expect(screen.getByText('Description: This is a test task')).toBeInTheDocument();
  });

  test('renders Update and Delete buttons for admin', () => {
    render(<TaskCard task={task} onUpdate={onUpdate} onDelete={onDelete} isAdmin={true} handleShowUpdateModal={handleShowUpdateModal} />);

    // Check if Update and Delete buttons are rendered for admin
    expect(screen.getByText('Update Task')).toBeInTheDocument();
    expect(screen.getByText('Delete Task')).toBeInTheDocument();
  });

  test('does not render Update and Delete buttons for non-admin', () => {
    render(<TaskCard task={task} onUpdate={onUpdate} onDelete={onDelete} isAdmin={false} handleShowUpdateModal={handleShowUpdateModal} />);

    // Ensure the Update and Delete buttons are not rendered for non-admin
    expect(screen.queryByText('Update Task')).not.toBeInTheDocument();
    expect(screen.queryByText('Delete Task')).not.toBeInTheDocument();
  });

  test('calls onDelete when Delete button is clicked (admin)', () => {
    render(<TaskCard task={task} onUpdate={onUpdate} onDelete={onDelete} isAdmin={true} handleShowUpdateModal={handleShowUpdateModal} />);

    // Click the Delete button
    fireEvent.click(screen.getByText('Delete Task'));

    // Ensure onDelete is called with the correct task ID
    expect(onDelete).toHaveBeenCalledWith(task._id);
  });

  test('calls handleShowUpdateModal when Update Task button is clicked (admin)', () => {
    render(<TaskCard task={task} onUpdate={onUpdate} onDelete={onDelete} isAdmin={true} handleShowUpdateModal={handleShowUpdateModal} />);

    // Click the Update Task button
    fireEvent.click(screen.getByText('Update Task'));

    // Ensure handleShowUpdateModal is called with the task object
    expect(handleShowUpdateModal).toHaveBeenCalledWith(task);
  });

  test('calls onUpdate when status is changed (non-admin)', () => {
    render(<TaskCard task={task} onUpdate={onUpdate} onDelete={onDelete} isAdmin={false} handleShowUpdateModal={handleShowUpdateModal} />);

    // Select a new status for the task
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'InProgress' } });

    // Ensure onUpdate is called with correct task ID and updated status
    expect(onUpdate).toHaveBeenCalledWith(task._id, { status: 'InProgress' });
  });

  test('does not render status dropdown for completed tasks (non-admin)', () => {
    const completedTask = { ...task, status: 'Completed' };
    
    render(<TaskCard task={completedTask} onUpdate={onUpdate} onDelete={onDelete} isAdmin={false} handleShowUpdateModal={handleShowUpdateModal} />);

    // Ensure the status dropdown is not rendered for completed tasks
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  test('renders the assigned user for admin', () => {
    render(<TaskCard task={task} onUpdate={onUpdate} onDelete={onDelete} isAdmin={true} handleShowUpdateModal={handleShowUpdateModal} />);

    // Ensure the assigned user is displayed for admin
    expect(screen.getByText('User : John Doe')).toBeInTheDocument();
  });

  test('does not render the assigned user for non-admin', () => {
    render(<TaskCard task={task} onUpdate={onUpdate} onDelete={onDelete} isAdmin={false} handleShowUpdateModal={handleShowUpdateModal} />);

    // Ensure the assigned user is not displayed for non-admin
    expect(screen.queryByText('User : John Doe')).not.toBeInTheDocument();
  });
});
