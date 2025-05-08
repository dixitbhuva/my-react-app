import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState(() => {
    // Load tasks from localStorage on initial render
    const storedTasks = localStorage.getItem('tasks');
    return storedTasks ? JSON.parse(storedTasks) : [];
  });

  const [filter, setFilter] = useState('all'); // all, completed, pending
  const [search, setSearch] = useState('');
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '' });
  const [editingTaskId, setEditingTaskId] = useState(null); // Track the task being edited

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!newTask.title || !newTask.dueDate) return alert('Title and Due Date are required!');
    const task = { ...newTask, id: Date.now(), completed: false, createdAt: new Date().toISOString() };
    setTasks([...tasks, task]);
    setNewTask({ title: '', description: '', dueDate: '' });
  };

  const toggleTaskCompletion = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const startEditingTask = (id) => {
    const taskToEdit = tasks.find(task => task.id === id);
    setNewTask({ title: taskToEdit.title, description: taskToEdit.description, dueDate: taskToEdit.dueDate });
    setEditingTaskId(id);
  };

  const saveEditedTask = () => {
    if (!newTask.title || !newTask.dueDate) return alert('Title and Due Date are required!');
    setTasks(tasks.map(task => task.id === editingTaskId ? { ...task, ...newTask } : task));
    setNewTask({ title: '', description: '', dueDate: '' });
    setEditingTaskId(null);
  };

  const cancelEditing = () => {
    setNewTask({ title: '', description: '', dueDate: '' });
    setEditingTaskId(null);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  }).filter(task => task.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="App">
      <h1>Task Manager</h1>

      {/* Add/Edit Task Form */}
      <div className="task-form">
        <input
          type="text"
          placeholder="Task Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <textarea
          placeholder="Task Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        />
        <input
          type="date"
          value={newTask.dueDate}
          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
        />
        {editingTaskId ? (
          <>
            <button onClick={saveEditedTask}>Save</button>
            <button onClick={cancelEditing}>Cancel</button>
          </>
        ) : (
          <button onClick={addTask}>Add Task</button>
        )}
      </div>

      {/* Filters and Search */}
      <div className="filters">
        <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>All</button>
        <button onClick={() => setFilter('completed')} className={filter === 'completed' ? 'active' : ''}>Completed</button>
        <button onClick={() => setFilter('pending')} className={filter === 'pending' ? 'active' : ''}>Pending</button>
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Task List */}
      <div className="task-list">
        {filteredTasks.map(task => (
          <div key={task.id} className={`task ${task.completed ? 'completed' : ''}`}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Due: {task.dueDate}</p>
            <div className="actions">
              <button onClick={() => toggleTaskCompletion(task.id)}>
                {task.completed ? 'Mark Pending' : 'Mark Completed'}
              </button>
              <button onClick={() => startEditingTask(task.id)}>Edit</button>
              <button onClick={() => deleteTask(task.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
