// TaskDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import TaskCard from '../../components/TaskCard/TaskCard';
import './taskdashboard.css';
import { fetchTasks, createTask, updateTask, deleteTask, fetchAllUsers, fetchUserTasks } from '../../services/api';
import ModalComponent from '../../components/Modal/Modal';
import Form from 'react-bootstrap/Form';


const TaskDashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [show, setShow] = useState({
    create: false,
    update: false
  });
  const [taskDetails, setTaskDetails] = useState({
    title: "",
    description: "",
    deadline: "",
    status: "",
    assignedTo: "",
  });
  const [taskId, setTaskId] = useState("");
  const [userTaskslist,setUserTasksList] = useState([]);

  const loadTasks = async () => {
    try {
      const data = await fetchTasks();
      setTasks(data?.data);
    } catch (err) {
      
    }
  };

  const loadUsers = async () => {
    try {
      const data = await fetchAllUsers();
      setUsers(data?.data);
    } catch (err) {
      // setError('Failed to load tasks.');
    }
  }

  const userTasks = async () => {
    try {
        const userTasklist = await fetchUserTasks();
        console.log('userTaskslist',userTasklist)
        setUserTasksList(userTasklist?.data)
    } catch (error) {
        console.log('error',error);
    }
  }

  


  useEffect(() => {
    loadTasks();
    loadUsers();
    userTasks();
  }, []);

  const hansleSubmitModal = async () => {
    try {
      if (show.create) {
        const createdTask = await createTask(taskDetails);
        if (createdTask?.success) {
          setShow((prev) => ({
            ...prev,
            create: false
          }));
          loadTasks();
          setTaskDetails({
            title: "",
            description: "",
            deadline: "",
            status: "",
            assignedTo: "",
          });
          return alert("Task created successfully");
        }
      } else {
        const updatedTask = await updateTask(taskId, taskDetails);
        if (updatedTask?.success) {
          setShow((prev) => ({
            ...prev,
            update: false
          }));
          loadTasks();
          setTaskDetails({
            title: "",
            description: "",
            deadline: "",
            status: "",
            assignedTo: "",
          });
          return alert("Task updated successfully");
        }
      }
    } catch (err) {
      setError('Failed to create task.');
    }
  };

  const handleUpdateTask = async (taskId, statusValue) => {
    try {
      const updatedTask = await updateTask(taskId, statusValue);
      if(updatedTask?.success){
        userTasks();
        return  alert("Task status updated successfully");
      }
    } catch (err) {
      setError('Failed to update task.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const removedTask = await deleteTask(taskId);
      if (removedTask?.success) {
        loadTasks();
        alert("Task deleted successfully");
      }
    } catch (err) {
      setError('Failed to delete task.');
    }
  };

  const handleShowModal = async () => {
    setShow((prev) => ({
      ...prev,
      create: true
    }));
    const data = await fetchAllUsers();
  }

  const handleCollectTaskDetails = (event) => {
    const { name, value } = event.target;

    setTaskDetails((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleShowUpdateModal = (task) => {
    setTaskId(task._id);
    setTaskDetails((prev) => ({
      ...prev,
      title: task?.title,
      status: task?.status,
      description: task?.description,
      deadline: task?.deadline,
      assignedTo: task?.assignedTo
    }))
    setShow((prev) => ({
      ...prev,
      update: true
    }))
  }

  const formatDeadline = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    return date.toISOString().split("T")[0]; // Extract only the date part
  };


  const renderAdminPanel = () => (
    <div className="admin-panel">
      <h3>Admin Panel</h3>
      <button onClick={handleShowModal}>
        Create New Task
      </button>
      <div>
        <h2>TaskList</h2>
        <div className="task-list">
          {tasks?.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdate={handleUpdateTask}
              onDelete={handleDeleteTask}
              isAdmin={user?.role === "Admin"}
              handleShowUpdateModal={handleShowUpdateModal}
            />
          ))}
        </div>
      </div>


      <ModalComponent show={show.create ? show.create : show.update} setShow={setShow} title={show.create ? "Create Task" : "Update task"} hansleSubmitModal={hansleSubmitModal}>
        <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="title...."
              autoFocus
              name='title'
              onChange={handleCollectTaskDetails}
              value={taskDetails?.title ? taskDetails?.title : ''}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              placeholder="description...."
              autoFocus
              name='description'
              onChange={handleCollectTaskDetails}
              value={taskDetails?.description ? taskDetails?.description : ''}

            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Deadline</Form.Label>
            <Form.Control
              type="date"
              placeholder="Date"
              autoFocus
              name='deadline'
              onChange={handleCollectTaskDetails}
              value={formatDeadline(taskDetails?.deadline ? taskDetails?.deadline : '')}

            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Status</Form.Label>
            <Form.Select aria-label="Default select example" name='status' onChange={handleCollectTaskDetails} value={taskDetails?.status ? taskDetails?.status : ''}
            >
              <option>Status</option>
              <option value="Pending">Pending</option>
              <option value="InProgress">Incomplete</option>
              <option value="Completed">Complete</option>
            </Form.Select>


          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Assigned to</Form.Label>
            <Form.Select aria-label="Default select example" name='assignedTo' onChange={handleCollectTaskDetails} value={taskDetails?.assignedTo?._id ? taskDetails?.assignedTo?._id : ''}
            >

              {
                users?.map((usr) => {
                  return (
                    <option value={usr?._id} >{usr?.name}</option>
                  )
                })
              }
            </Form.Select>
          </Form.Group>
        </Form>
      </ModalComponent>
    </div>
  );

  const renderUserPanel = () => (
    <div className="user-panel">
      <h3>User Panel</h3>
      <div className="task-list">
        {userTaskslist?.map((task) => (
          <TaskCard key={task.id} task={task} onUpdate={handleUpdateTask} isAdmin={false} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="task-dashboard">
      <h2>Task Dashboard</h2>
      {error && <p className="error-message">{error}</p>}
      {user && user.role === 'Admin' ? renderAdminPanel() : renderUserPanel()}
    </div>
  );
};

export default TaskDashboard;
