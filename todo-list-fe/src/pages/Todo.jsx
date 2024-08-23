import React, { useState } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useTaskStore } from '../contexts/TaskContext';
import TaskList from '../components/Task/TaskList';
import TaskFormModal from '../components/Task/TaskFormModal';

const Todo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const { addTask } = useTaskStore();

  const handleCreateTask = (newTask) => {
    addTask({ ...newTask, id: Date.now(), comments: [] });
  };

  const openCreateTaskModal = () => {
    setCurrentTask(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8 }}>
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
          <TaskList />
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
