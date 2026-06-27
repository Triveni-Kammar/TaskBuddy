import { useState, useEffect, useMemo } from 'react';
import Taskform from './Components/Taskform';
import Tasklist from './Components/Tasklist';
import Progresstracker from './Components/Progresstracker';
import FilterBar from './Components/FilterBar';
import './index.css';

const PRIORITY_ORDER = { High: 0, Medium: 1, Low: 2 };

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const saved = localStorage.getItem('tasks');
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch {
        /* ignore corrupt data */
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const addTask = (task) => {
    setTasks((prev) => [
      ...prev,
      { ...task, id: crypto.randomUUID(), createdAt: Date.now() },
    ]);
  };

  const updateTask = (updatedTask) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const clearTasks = () => {
    if (window.confirm('Clear all tasks? This cannot be undone.')) {
      setTasks([]);
    }
  };

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((t) => t.text.toLowerCase().includes(q));
    }

    if (statusFilter === 'active') {
      result = result.filter((t) => !t.completed);
    } else if (statusFilter === 'completed') {
      result = result.filter((t) => t.completed);
    }

    if (categoryFilter !== 'all') {
      result = result.filter((t) => t.category === categoryFilter);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          return (PRIORITY_ORDER[a.priority] ?? 1) - (PRIORITY_ORDER[b.priority] ?? 1);
        case 'dueDate': {
          const aDue = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
          const bDue = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
          return aDue - bDue;
        }
        case 'name':
          return a.text.localeCompare(b.text);
        case 'newest':
        default:
          return (b.createdAt ?? 0) - (a.createdAt ?? 0);
      }
    });

    return result;
  }, [tasks, search, statusFilter, categoryFilter, sortBy]);

  const toggleTheme = () => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-brand">
          <div className="logo-mark" aria-hidden="true">✓</div>
          <div>
            <h1>TaskBuddy</h1>
            <p className="tagline">Your friendly task manager</p>
          </div>
        </div>
        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </header>

      <Progresstracker tasks={tasks} />

      <Taskform addTask={addTask} />

      {tasks.length > 0 && (
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      )}

      <Tasklist
        tasks={filteredTasks}
        totalCount={tasks.length}
        updateTask={updateTask}
        deleteTask={deleteTask}
      />

      {tasks.length > 0 && (
        <button type="button" className="clear-btn" onClick={clearTasks}>
          Clear all tasks
        </button>
      )}

      <footer className="app-footer">
        <span>Built with React · Tasks saved locally</span>
      </footer>
    </div>
  );
}
