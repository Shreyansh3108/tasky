import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const useTaskData = (userId) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const storedTasks = localStorage.getItem('tasks');
        const parsedTasks = storedTasks ? JSON.parse(storedTasks) : [];
        
        const userTasks = userId 
          ? parsedTasks.filter(task => task.userId === userId)
          : parsedTasks;
          
        if (!storedTasks || userTasks.length === 0) {
          const sampleTasks = [
            {
              id: uuidv4(),
              title: 'Complete project proposal',
              description: 'Finish the initial draft for the client presentation',
              priority: 'high',
              completed: false,
              createdAt: new Date().toISOString(),
              userId: userId || '1'
            },
            {
              id: uuidv4(),
              title: 'Review code changes',
              description: 'Check the pull request from the development team',
              priority: 'medium',
              completed: false,
              createdAt: new Date().toISOString(),
              userId: userId || '1'
            },
            {
              id: uuidv4(),
              title: 'Update documentation',
              description: 'Update the API documentation with recent changes',
              priority: 'low',
              completed: true,
              createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
              userId: userId || '1'
            }
          ];
          
          setTasks(sampleTasks);
          
          // Store sample tasks
          localStorage.setItem('tasks', JSON.stringify([
            ...parsedTasks.filter(task => task.userId !== userId),
            ...sampleTasks
          ]));
        } else {
          setTasks(userTasks);
        }
      } catch (err) {
        setError('Failed to load tasks');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchTasks();
    }
  }, [userId]);

  const addTask = async (taskData) => {
    try {
      const newTask = {
        ...taskData,
        id: uuidv4(),
        userId
      };
      
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      
      const storedTasks = localStorage.getItem('tasks');
      const parsedTasks = storedTasks ? JSON.parse(storedTasks) : [];
      localStorage.setItem('tasks', JSON.stringify([
        ...parsedTasks.filter(task => task.userId !== userId || task.id !== newTask.id),
        newTask
      ]));
      
      return newTask;
    } catch (err) {
      setError('Failed to add task');
      console.error(err);
    }
  };

  const updateTask = async (updatedTask) => {
    try {
      const updatedTasks = tasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      );
      
      setTasks(updatedTasks);
      
      const storedTasks = localStorage.getItem('tasks');
      const parsedTasks = storedTasks ? JSON.parse(storedTasks) : [];
      localStorage.setItem('tasks', JSON.stringify([
        ...parsedTasks.filter(task => task.userId !== userId || task.id !== updatedTask.id),
        updatedTask
      ]));
      
      return updatedTask;
    } catch (err) {
      setError('Failed to update task');
      // hooks/useTaskData.js (continued)
      console.error(err);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      setTasks(updatedTasks);
      
      const storedTasks = localStorage.getItem('tasks');
      const parsedTasks = storedTasks ? JSON.parse(storedTasks) : [];
      localStorage.setItem('tasks', JSON.stringify(
        parsedTasks.filter(task => task.id !== taskId)
      ));
      
      return taskId;
    } catch (err) {
      setError('Failed to delete task');
      console.error(err);
    }
  };

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask
  };
};
