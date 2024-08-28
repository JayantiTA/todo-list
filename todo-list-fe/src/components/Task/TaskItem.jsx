import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Typography, Box, Button, IconButton, TextField } from '@mui/material';
import { useTaskStore } from '../../contexts/TaskContext';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TaskFormModal from './TaskFormModal'; // Ensure TaskFormModal is imported
import { getApiUrl } from '../../utils/utils';
import { useAuthStore } from '../../contexts/AuthContext';
import axios from 'axios';

const TaskItem = ({ task, loadTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { updateTask, deleteTask } = useTaskStore();
  const [comment, setComment] = useState('');
  const session = useAuthStore.getState();
  const { accessToken } = session?.session || {};

  const handleEdit = async () => {
    const url = getApiUrl(`/tasks/${task.id}`);
    try {
      const res = await axios.put(url, task, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      await loadTask();
      updateTask(res.data);
    } catch (error) {
      console.error('Error updating task:', error);
    }
    setIsEditing(false);
  };

  const handleDelete = async () => {
    const url = getApiUrl(`/tasks/${task.id}`);
    const commentUrl = getApiUrl(`/comments/task/${task.id}`);
    try {
      await axios.delete(commentUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      await axios.delete(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      await loadTask();
      deleteTask(task.id);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleComment = async () => {
    const url = getApiUrl('/comments')
    try {
      await axios.post(url, { taskId: task.id, content: comment }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      await loadTask();
      setComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
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
      <Typography variant="caption">Due: {new Date(task.dueDate).toISOString().split('T')[0]}</Typography>
      <br />
      <Typography variant="caption">Assigned to: {task.assignee?.email}</Typography>
      <br />
      <Typography variant="caption">Created by: {task.user.email}</Typography>
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
        <>
          {task.comments.length > 0 && (
            <Typography variant="h6" sx={{ mt: 2 }}>
              Comments
            </Typography>
          )}
          <Box sx={{ mt: 2 }}>
            {task.comments.map((comment) => (
              <Typography key={comment.id} variant="body2">
                {comment.createdAt} - {comment.user.email}
                <br />
                <strong>
                  {comment.content}
                </strong>
              </Typography>
            ))}
          </Box>
        </>
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

TaskItem.propTypes = {
  task: PropTypes.object.isRequired,
  loadTask: PropTypes.func.isRequired,
};

export default TaskItem;
