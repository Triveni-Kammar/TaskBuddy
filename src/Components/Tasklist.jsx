import { useState } from 'react';

function formatDueDate(dateStr) {
  if (!dateStr) return null;
  const due = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

  if (diff < 0) return { label: 'Overdue', className: 'overdue' };
  if (diff === 0) return { label: 'Due today', className: 'due-today' };
  if (diff === 1) return { label: 'Due tomorrow', className: 'due-soon' };
  return {
    label: due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    className: '',
  };
}

export default function TaskList({ tasks, totalCount, updateTask, deleteTask }) {
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const toggleComplete = (task) => {
    updateTask({ ...task, completed: !task.completed });
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  const saveEdit = (task) => {
    const trimmed = editText.trim();
    if (trimmed) {
      updateTask({ ...task, text: trimmed });
    }
    setEditingId(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  if (totalCount === 0) {
    return (
      <div className="empty-state">
        <p>No tasks yet — add one above to get started!</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="empty-state empty-filtered">
        <p>No tasks match your filters.</p>
      </div>
    );
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => {
        const due = formatDueDate(task.dueDate);
        const isEditing = editingId === task.id;

        return (
          <li
            key={task.id}
            className={`task-item${task.completed ? ' completed' : ''}${due?.className ? ` ${due.className}` : ''}`}
          >
            <label className="task-checkbox-wrap">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleComplete(task)}
                aria-label={`Mark "${task.text}" as ${task.completed ? 'incomplete' : 'complete'}`}
              />
            </label>

            <div className="task-content">
              {isEditing ? (
                <div className="edit-row">
                  <input
                    type="text"
                    className="edit-input"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit(task);
                      if (e.key === 'Escape') cancelEdit();
                    }}
                    autoFocus
                  />
                  <button type="button" className="btn-save" onClick={() => saveEdit(task)}>
                    Save
                  </button>
                  <button type="button" className="btn-cancel" onClick={cancelEdit}>
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <span className="task-name">{task.text}</span>
                  <div className="task-meta">
                    <span className={`priority ${task.priority.toLowerCase()}`}>
                      {task.priority}
                    </span>
                    <span className="category">{task.category}</span>
                    {due && (
                      <span className={`due-badge ${due.className}`}>{due.label}</span>
                    )}
                  </div>
                </>
              )}
            </div>

            {!isEditing && (
              <div className="task-actions">
                <button
                  type="button"
                  className="btn-edit"
                  onClick={() => startEdit(task)}
                  aria-label={`Edit "${task.text}"`}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className={`btn-complete${task.completed ? ' undo' : ''}`}
                  onClick={() => toggleComplete(task)}
                >
                  {task.completed ? 'Undo' : 'Done'}
                </button>
                <button
                  type="button"
                  className="delete"
                  onClick={() => deleteTask(task.id)}
                  aria-label={`Delete "${task.text}"`}
                >
                  Delete
                </button>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
