import React, { useState } from 'react';
import { Typography, Box, Button, IconButton, MenuItem, TextField } from '@mui/material';
import { useTaskStore } from '../../contexts/TaskContext';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TaskFormModal from './TaskFormModal'; // Ensure TaskFormModal is imported

const TaskItem = ({ task }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { updateTask, deleteTask, assignTask, addComment, users } = useTaskStore();
  const [comment, setComment] = useState('');

  const handleEdit = (updatedTask) => {
    updateTask(updatedTask);
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteTask(task.id);
  };

  const handleAssign = (e) => {
    assignTask(task.id, e.target.value);
  };

  const handleComment = () => {
    addComment(task.id, comment);
    setComment('');
  };

  const handleOpenEditModal = () => {
    setIsEditing(true);
  };

  const handleCloseModal = () => {
    setIsEditing(false);
  };

  return (
    <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 2, mb: 2 }}>
      <Typography variant="h6">{task.title}</Typography>
      <Typography variant="body1">{task.description}</Typography>
      <Typography variant="caption">Status: {task.status}</Typography>
      <br />
      <Typography variant="caption">Due: {task.dueDate}</Typography>
      <TextField
        label="Assign to"
        select
        value={task.assignedTo || ''}
        onChange={handleAssign}
        fullWidth
        sx={{ mt: 2 }}
      >
        {users.map((user) => (
          <MenuItem key={user} value={user}>
            {user}
          </MenuItem>
        ))}
      </TextField>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button variant="contained" color="primary" onClick={handleOpenEditModal}>
          <EditIcon />
          Edit
        </Button>
        <IconButton color="error" onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>
      </Box>
      <Box sx={{ mt: 2 }}>
        <TextField
          label="Add Comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          fullWidth
          multiline
          rows={2}
        />
        <Button variant="contained" color="secondary" sx={{ mt: 1 }} onClick={handleComment}>
          Comment
        </Button>
      </Box>
      {task.comments && (
        <Box sx={{ mt: 2 }}>
          {task.comments.map((c, index) => (
            <Typography key={index} variant="body2">
              {c}
            </Typography>
          ))}
        </Box>
      )}
      <TaskFormModal
        open={isEditing}
        onClose={handleCloseModal}
        onSubmit={handleEdit}
        task={task}
      />
    </Box>
  );
};

export default TaskItem;
