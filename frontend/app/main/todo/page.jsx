'use client'
import React, { useState } from 'react';
import { PlusCircle, Edit2, Trash2, ThumbsUp } from 'lucide-react';

const initialTasks = [
  { id: 'task-1', title: 'Create mockups', description: 'Design initial mockups for the homepage', color: 'bg-red-200', status: 'todo', likes: 0 },
  { id: 'task-2', title: 'Design database', description: 'Create schema for user authentication', color: 'bg-blue-200', status: 'todo', likes: 2 },
  { id: 'task-3', title: 'Develop API', description: 'Implement RESTful API for task management', color: 'bg-green-200', status: 'inProgress', likes: 1 },
  { id: 'task-4', title: 'Project setup', description: 'Initialize repository and set up project structure', color: 'bg-yellow-200', status: 'done', likes: 3 },
];

const columns = {
  todo: { id: 'todo', title: 'To Do' },
  inProgress: { id: 'inProgress', title: 'In Progress' },
  done: { id: 'done', title: 'Done' },
};

const colors = ['bg-red-200', 'bg-blue-200', 'bg-green-200', 'bg-yellow-200', 'bg-purple-200', 'bg-pink-200'];

const KanbanBoard = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [editingTask, setEditingTask] = useState(null);

  const addTask = (status, title, description) => {
    if (title.trim() === '') return;
    const newTask = {
      id: `task-${Date.now()}`,
      title,
      description,
      color: colors[Math.floor(Math.random() * colors.length)],
      status,
      likes: 0,
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (taskId, newTitle, newDescription) => {
    if (newTitle.trim() === '') return;
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, title: newTitle, description: newDescription } : task
      )
    );
    setEditingTask(null);
  };

  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const changeTaskStatus = (taskId, newStatus) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const likeTask = (taskId) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, likes: task.likes + 1 } : task
      )
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Kanban Board</h1>
      <div className="flex space-x-4">
        {Object.entries(columns).map(([columnId, column]) => (
          <div key={columnId} className="bg-gray-100 p-2 rounded-lg w-80">
            <h2 className="font-semibold mb-2">{column.title}</h2>
            <div className="space-y-2">
              {tasks
                .filter(task => task.status === columnId)
                .map(task => (
                  <div key={task.id} className={`${task.color} p-3 rounded shadow`}>
                    {editingTask === task.id ? (
                      <div>
                        <input
                          type="text"
                          value={task.title}
                          onChange={(e) => updateTask(task.id, e.target.value, task.description)}
                          className="w-full bg-white p-1 rounded mb-2"
                          autoFocus
                        />
                        <textarea
                          value={task.description}
                          onChange={(e) => updateTask(task.id, task.title, e.target.value)}
                          className="w-full bg-white p-1 rounded mb-2"
                          rows="3"
                        />
                        <button onClick={() => setEditingTask(null)} className="bg-blue-500 text-white px-2 py-1 rounded">
                          Save
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-semibold">{task.title}</h3>
                          <div className="flex space-x-2">
                            <button onClick={() => setEditingTask(task.id)} className="text-blue-500">
                              <Edit2 size={16} />
                            </button>
                            <button onClick={() => deleteTask(task.id)} className="text-red-500">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm mb-2">{task.description}</p>
                        <div className="flex justify-between items-center">
                          <select
                            value={task.status}
                            onChange={(e) => changeTaskStatus(task.id, e.target.value)}
                            className="bg-white rounded p-1 text-sm"
                          >
                            {Object.entries(columns).map(([status, col]) => (
                              <option key={status} value={status}>
                                {col.title}
                              </option>
                            ))}
                          </select>
                          <button onClick={() => likeTask(task.id)} className="flex items-center space-x-1 text-blue-500">
                            <ThumbsUp size={16} />
                            <span>{task.likes}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
            <AddTaskForm onAdd={(title, description) => addTask(columnId, title, description)} />
          </div>
        ))}
      </div>
    </div>
  );
};

const AddTaskForm = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() !== '') {
      onAdd(title, description);
      setTitle('');
      setDescription('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2 space-y-2">
      <input
        type="text"
        placeholder="Task title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-1 rounded"
      />
      <textarea
        placeholder="Task description..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-1 rounded"
        rows="3"
      />
      <button type="submit" className="bg-blue-500 text-white p-1 rounded flex items-center justify-center w-full">
        <PlusCircle size={20} className="mr-1" />
        Add Task
      </button>
    </form>
  );
};

export default KanbanBoard;