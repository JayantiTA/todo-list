import React, { useState } from 'react';
import { TextField, Button, MenuItem, Box } from '@mui/material';
import PropTypes from 'prop-types'; // Import PropTypes
import { useTaskStore } from '../../contexts/TaskContext';

const TaskForm = ({ task = {}, onSubmit }) => {
  const [title, setTitle] = useState(task.title || '');
  const [description, setDescription] = useState(task.description || '');
  const [status, setStatus] = useState(task.status || 'To Do');
  const [dueDate, setDueDate] = useState(task.dueDate || '');
  const { users } = useTaskStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...task, title, description, status, dueDate });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        multiline
        rows={3}
      />
      <TextField
        label="Status"
        select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <MenuItem value="To Do">To Do</MenuItem>
        <MenuItem value="In Progress">In Progress</MenuItem>
        <MenuItem value="Done">Done</MenuItem>
      </TextField>
      <TextField
        label="Due Date"
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <Button type="submit" variant="contained" color="primary">
        {task.id ? 'Update Task' : 'Create Task'}
      </Button>
    </Box>
  );
};

TaskForm.propTypes = {
  task: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
};

export default TaskForm;
