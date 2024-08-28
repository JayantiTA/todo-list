import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useTaskStore } from '../contexts/TaskContext';
import TaskList from '../components/Task/TaskList';
import TaskFormModal from '../components/Task/TaskFormModal';
import { getApiUrl } from '../utils/utils';
import axios from 'axios';
import { useAuthStore } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Todo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const { setComments, addTask } = useTaskStore();
  const { session } = useAuthStore.getState();
  const { accessToken } = session || {};
  const navigate = useNavigate();

  const handleCreateTask = (newTask) => {
    const url = getApiUrl('/tasks');
    try {
      axios.post(url, newTask, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
      });
      loadAllTasks();
      addTask(newTask);
    } catch (error) {
      console.error('Error creating tasks:', error);
    }
  };

  const handleLogout = () => {
    useAuthStore.setState({ session: null });
    navigate('/login');
  }

  const loadAllTasks = async () => {
    const url = getApiUrl('/tasks');
    try {
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      useTaskStore.setState({ tasks: response.data });
      await loadAllComments();
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  }

  const loadAllComments = async () => {
    const url = getApiUrl('/comments');
    try {
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      setComments(response.data);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  }

  const openCreateTaskModal = () => {
    setCurrentTask(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (!accessToken) {
      console.error('No access token available');
      navigate('/login');
      return;
    }
    loadAllTasks();
  }, []);

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 5 }}>
        <Button variant="outlined" color="error" onClick={handleLogout} sx={{ mb: 2 }}>
          Logout
        </Button>
        <Typography variant="h4" gutterBottom>
          Todo List
        </Typography>
        <Button variant="contained" color="primary" onClick={openCreateTaskModal}>
          Create Task
        </Button>
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Tasks
          </Typography>
          <TaskList loadTask={loadAllTasks}/>
        </Box>
        <TaskFormModal
          open={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleCreateTask}
          task={currentTask}
        />
      </Box>
    </Container>
  );
};

export default Todo;
