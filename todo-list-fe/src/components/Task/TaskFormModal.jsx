import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem, Box, Typography } from '@mui/material';
import { getApiUrl } from '../../utils/utils';
import { useAuthStore } from '../../contexts/AuthContext';
import axios from 'axios';

const TaskFormModal = ({ open, onClose, task = {}, onSubmit }) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [status, setStatus] = useState(task?.status || 'To Do');
  const [assigneeEmail, setAssigneeEmail] = useState(task?.assignee?.email || '');
  const [dueDate, setDueDate] = useState(task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
  const [emailStatus, setEmailStatus] = useState('');
  const session = useAuthStore.getState();
  const { accessToken } = session?.session || {};

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...task, title, description, status, dueDate, assigneeEmail });
    onClose();
  };

  const checkEmail = async () => {
    console.log(task)
    if (assigneeEmail === '') {
      console.error('Email is required');
      return;
    }

    const url = getApiUrl(`/users/email/${assigneeEmail}`);
    try {
      await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      setEmailStatus('valid');
    } catch {
      setEmailStatus('invalid');
      console.error('Error checking email');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{task?.id ? 'Edit Task' : 'Create Task'}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2, mt: 1 }}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={3}
            fullWidth
          />
          <TextField
            label="Status"
            select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            fullWidth
          >
            <MenuItem value="To Do">To Do</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Done">Done</MenuItem>
          </TextField>
          <Box sx={{ display: 'flex', width: '100%', gap: 1 }}>
            <TextField
              label="Assignee Email (Optional)"
              value={assigneeEmail}
              onChange={(e) => setAssigneeEmail(e.target.value)}
              fullWidth
            />
            <Button variant="contained" color="primary" onClick={checkEmail}>
              Check
            </Button>
          </Box>
          {emailStatus === 'valid' && (
            <Typography variant="body2" color="green">
              Email is available.
            </Typography>
          )}
          {emailStatus === 'invalid' && (
            <Typography variant="body2" color="red">
              Email is not available.
            </Typography>
          )}
          <TextField
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button type="submit" onClick={handleSubmit} variant="contained" color="primary">
          {task?.id ? 'Update Task' : 'Create Task'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

TaskFormModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  task: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
};
export default TaskFormModal;
