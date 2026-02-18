import React, { useState, useEffect } from 'react';
import './App.css';
import AuthForm from './components/AuthForm';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import api from './services/api';

function App() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      setUser(JSON.parse(userData));
      loadTasks();
    }
  }, []);

  const loadTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Erreur chargement tâches:', error);
    }
  };

  const handleAuth = (userData, token) => {
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    loadTasks();
  };

  const handleLogout = () => {
    setUser(null);
    setTasks([]);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const handleAddTask = async (taskData) => {
    try {
      const response = await api.post('/tasks', taskData);
      setTasks([response.data, ...tasks]);
    } catch (error) {
      console.error('Erreur ajout tâche:', error);
    }
  };

  const handleToggleTask = async (taskId) => {
    try {
      const task = tasks.find(t => t._id === taskId);
      const response = await api.put(`/tasks/${taskId}`, {
        completed: !task.completed
      });
      setTasks(tasks.map(t => t._id === taskId ? response.data : t));
    } catch (error) {
      console.error('Erreur mise à jour tâche:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter(t => t._id !== taskId));
    } catch (error) {
      console.error('Erreur suppression tâche:', error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  if (!user) {
    return (
      <div className="App">
        <AuthForm onAuth={handleAuth} />
      </div>
    );
  }

  return (
    <div className="App">
      <header>
        <h1>📝 Task Manager</h1>
        <div className="user-info">
          <span>Bienvenue, {user.username}!</span>
          <button onClick={handleLogout} className="btn-logout">Déconnexion</button>
        </div>
      </header>

      <main>
        <TaskForm onAddTask={handleAddTask} />

        <div className="filters">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            Toutes ({tasks.length})
          </button>
          <button
            className={filter === 'active' ? 'active' : ''}
            onClick={() => setFilter('active')}
          >
            Actives ({tasks.filter(t => !t.completed).length})
          </button>
          <button
            className={filter === 'completed' ? 'active' : ''}
            onClick={() => setFilter('completed')}
          >
            Complétées ({tasks.filter(t => t.completed).length})
          </button>
        </div>

        <TaskList
          tasks={filteredTasks}
          onToggle={handleToggleTask}
          onDelete={handleDeleteTask}
        />
      </main>
    </div>
  );
}

export default App;
