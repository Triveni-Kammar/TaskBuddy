import { useState } from 'react';

export default function TaskForm({ addTask }) {
  const [task, setTask] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [category, setCategory] = useState('General');
  const [dueDate, setDueDate] = useState('');

  const handlesubmit = (e) => {
    e.preventDefault();
    const trimmed = task.trim();
    if (!trimmed) return;

    addTask({
      text: trimmed,
      priority,
      category,
      dueDate: dueDate || null,
      completed: false,
    });

    setTask('');
    setPriority('Medium');
    setCategory('General');
    setDueDate('');
  };

  return (
    <form onSubmit={handlesubmit} className="task-form">
      <div className="form-row form-row-main">
        <input
          type="text"
          className="task-input"
          placeholder="What needs to be done?"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          maxLength={200}
        />
        <button type="submit" className="btn-add">
          <span className="btn-icon">+</span>
          Add Task
        </button>
      </div>

      <div className="form-row form-row-options">
        <label className="field-label">
          Priority
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="High">🔴 High</option>
            <option value="Medium">🟡 Medium</option>
            <option value="Low">🟢 Low</option>
          </select>
        </label>

        <label className="field-label">
          Category
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="General">General</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
          </select>
        </label>

        <label className="field-label">
          Due date
          <input
            type="date"
            className="date-input"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
        </label>
      </div>
    </form>
  );
}
