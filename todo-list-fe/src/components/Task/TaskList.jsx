import React from 'react';
import PropTypes from 'prop-types';
import { useTaskStore } from '../../contexts/TaskContext';
import TaskItem from './TaskItem';

const TaskList = ({ loadTask }) => {
  const { tasks } = useTaskStore();

  return (
    <div>
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} loadTask={loadTask} />
      ))}
    </div>
  );
};

TaskList.propTypes = {
  loadTask: PropTypes.func.isRequired,
};

export default TaskList;
