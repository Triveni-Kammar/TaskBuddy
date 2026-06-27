export default function ProgressTracker({ tasks = [] }) {
  const completedTasks = tasks.filter((task) => task.completed).length;
  const activeTasks = tasks.length - completedTasks;
  const totalTasks = tasks.length;
  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const highPriority = tasks.filter((t) => !t.completed && t.priority === 'High').length;

  const getMessage = () => {
    if (totalTasks === 0) return 'Ready when you are!';
    if (progress === 100) return '🎉 All done — great work!';
    if (progress >= 75) return 'Almost there — keep going!';
    if (progress >= 50) return 'Halfway there!';
    if (highPriority > 0) return `${highPriority} high-priority task${highPriority > 1 ? 's' : ''} pending`;
    return 'You\'ve got this!';
  };

  return (
    <div className="progress-tracker">
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-value">{totalTasks}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-card stat-active">
          <span className="stat-value">{activeTasks}</span>
          <span className="stat-label">Active</span>
        </div>
        <div className="stat-card stat-done">
          <span className="stat-value">{completedTasks}</span>
          <span className="stat-label">Done</span>
        </div>
        <div className="stat-card stat-percent">
          <span className="stat-value">{progress}%</span>
          <span className="stat-label">Progress</span>
        </div>
      </div>

      <p className="progress-text">
        <span>{completedTasks}</span> of <span>{totalTasks}</span> tasks completed
        <em className="progress-message">{getMessage()}</em>
      </p>

      <div className="progress-bar" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
        <div className="progress" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
