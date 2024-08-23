import create from 'zustand';

export const useTaskStore = create((set) => ({
  tasks: [],
  users: ['User1', 'User2'], // Mock users for task assignment
  notifications: [],
  
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (updatedTask) => set((state) => ({
    tasks: state.tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    ),
  })),
  deleteTask: (taskId) => set((state) => ({
    tasks: state.tasks.filter((task) => task.id !== taskId),
  })),
  addComment: (taskId, comment) => set((state) => ({
    tasks: state.tasks.map((task) =>
      task.id === taskId ? { ...task, comments: [...task.comments, comment] } : task
    ),
  })),
  assignTask: (taskId, user) => set((state) => ({
    tasks: state.tasks.map((task) =>
      task.id === taskId ? { ...task, assignedTo: user } : task
    ),
    notifications: [...state.notifications, `Task ${taskId} assigned to ${user}`],
  })),
  addNotification: (message) => set((state) => ({
    notifications: [...state.notifications, message],
  })),
}));
