import create from 'zustand';

export const useTaskStore = create((set) => ({
  tasks: [],
  notifications: [],
  
  setTasks: (tasks) => set({ tasks }),
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
  setComments: (comments) => set((state) => ({
    tasks: state.tasks.map((task) => {
      const taskComments = comments.filter((comment) => comment.taskId === task.id);
      return { ...task, comments: taskComments };
    }),
  })),
  addNotification: (message) => set((state) => ({
    notifications: [...state.notifications, message],
  })),
}));
