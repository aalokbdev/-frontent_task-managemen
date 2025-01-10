import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import './taskcard.css';

const TaskCard = ({ task, onUpdate, onDelete, isAdmin, handleShowUpdateModal }) => {
  const [statusValue, setStatusValue] = useState("Pending");
  return (
    <div className="task-card">
      <h3>{task.title}</h3>
      <p>Status: {task.status}</p>
      <p>Deadline: {task.deadline}</p>
      <p>Description: {task?.description}</p>
      {
        isAdmin && <p>User : {task?.assignedTo?.name}</p>
      }

      {isAdmin && (
        <div className="admin-actions" style={{ display: "flex", justifyContent: "space-between" }}>
          <button onClick={() => {
            handleShowUpdateModal(task)
          }}>Update Task</button>
          <button onClick={() => onDelete(task._id)}>Delete Task</button>
        </div>
      )}

      {!isAdmin && task.status !== 'Completed' && (
        <Form.Select aria-label="Default select example" onChange={(e) => onUpdate(task._id, { status: e.target.value })} value={task?.status}>
          <option value="Pending">Pending</option>
          <option value="InProgress">InProgress</option>
          <option value="Completed">Completed</option>
        </Form.Select>
      )}
    </div>
  );
};

export default TaskCard;
