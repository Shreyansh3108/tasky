import React, { useState, useEffect, useContext } from 'react';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import TaskFilter from './TaskFilter';
import { AuthContext } from '../../context/AuthContext';
import { useTaskData } from '../../hooks/useTaskData';

const TaskDashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const { tasks, addTask, updateTask, deleteTask, loading, error } = useTaskData(currentUser?.id);
  const [filter, setFilter] = useState('all');
  const [filteredTasks, setFilteredTasks] = useState([]);

  useEffect(() => {
    if (tasks) {
      switch (filter) {
        case 'active':
          setFilteredTasks(tasks.filter(task => !task.completed));
          break;
        case 'completed':
          setFilteredTasks(tasks.filter(task => task.completed));
          break;
        default:
          setFilteredTasks(tasks);
      }
    }
  }, [tasks, filter]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  return (
    <div className="task-dashboard">
      <h1 className="text-3xl font-bold text-blue-800 mb-8">Task Dashboard</h1>
      
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-blue-700">Your Tasks</h2>
              <TaskFilter currentFilter={filter} onFilterChange={handleFilterChange} />
            </div>
            
            {loading ? (
              <div className="text-center py-8">Loading tasks...</div>
            ) : (
              <TaskList 
                tasks={filteredTasks} 
                onUpdateTask={updateTask} 
                onDeleteTask={deleteTask} 
              />
            )}
          </div>
        </div>
        
        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">Add New Task</h2>
            <TaskForm onAddTask={addTask} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDashboard;

import React from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, onUpdateTask, onDeleteTask }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No tasks found. Add a new task to get started!
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {tasks.map(task => (
        <TaskItem 
          key={task.id} 
          task={task} 
          onUpdateTask={onUpdateTask} 
          onDeleteTask={onDeleteTask} 
        />
      ))}
    </div>
  );
};

export default TaskList;

import React, { useState } from 'react';

const TaskItem = ({ task, onUpdateTask, onDeleteTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);
  const [editedPriority, setEditedPriority] = useState(task.priority);

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  const handleToggleComplete = () => {
    onUpdateTask({
      ...task,
      completed: !task.completed
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedTitle(task.title);
    setEditedDescription(task.description);
    setEditedPriority(task.priority);
  };

  const handleSaveEdit = () => {
    onUpdateTask({
      ...task,
      title: editedTitle,
      description: editedDescription,
      priority: editedPriority
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDeleteTask(task.id);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  if (isEditing) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="mb-3">
          <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="edit-title">
            Title
          </label>
          <input
            id="edit-title"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
        </div>
        
        <div className="mb-3">
          <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="edit-description">
            Description
          </label>
          <textarea
            id="edit-description"
            className="w-full px-3 py-2 border border-gray-300 rounded"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            rows="2"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="edit-priority">
            Priority
          </label>
          <select
            id="edit-priority"
            className="w-full px-3 py-2 border border-gray-300 rounded"
            value={editedPriority}
            onChange={(e) => setEditedPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        
        <div className="flex justify-end space-x-2">
          <button
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            onClick={handleCancelEdit}
          >
            Cancel
          </button>
          <button
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleSaveEdit}
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`border rounded-lg p-4 ${task.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-blue-200'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={handleToggleComplete}
            className="mr-3 h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
          />
          <div className={`${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
            <h3 className="font-medium text-lg">{task.title}</h3>
            <p className="text-sm mt-1">{task.description}</p>
            <div className="flex items-center mt-2 text-xs text-gray-500">
              <span className="mr-3">{formatDate(task.createdAt)}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={handleEdit}
            className="text-blue-600 hover:text-blue-800"
            title="Edit task"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800"
            title="Delete task"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;

import React, { useState } from 'react';

const TaskForm = ({ onAddTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    
    const newTask = {
      title,
      description,
      priority,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    onAddTask(newTask);
    
    setTitle('');
    setDescription('');
    setPriority('medium');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
          Title *
        </label>
        <input
          id="title"
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task description"
          rows="3"
        />
      </div>
      
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="priority">
          Priority
        </label>
        <select
          id="priority"
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      
      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Add Task
      </button>
    </form>
  );
};

export default TaskForm;

// components/tasks/TaskFilter.jsx
import React from 'react';

const TaskFilter = ({ currentFilter, onFilterChange }) => {
  const filters = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' }
  ];

  return (
    <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden">
      {filters.map(filter => (
        <button
          key={filter.value}
          className={`px-4 py-2 text-sm font-medium ${
            currentFilter === filter.value
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
          onClick={() => onFilterChange(filter.value)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default TaskFilter;
