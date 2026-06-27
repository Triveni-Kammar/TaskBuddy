export default function FilterBar({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  categoryFilter,
  onCategoryChange,
  sortBy,
  onSortChange,
}) {
  return (
    <div className="filter-bar">
      <div className="search-wrapper">
        <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          className="search-input"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="filter-controls">
        <select value={statusFilter} onChange={(e) => onStatusChange(e.target.value)} aria-label="Filter by status">
          <option value="all">All tasks</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>

        <select value={categoryFilter} onChange={(e) => onCategoryChange(e.target.value)} aria-label="Filter by category">
          <option value="all">All categories</option>
          <option value="General">General</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
        </select>

        <select value={sortBy} onChange={(e) => onSortChange(e.target.value)} aria-label="Sort tasks">
          <option value="newest">Newest first</option>
          <option value="priority">Priority</option>
          <option value="dueDate">Due date</option>
          <option value="name">Name A–Z</option>
        </select>
      </div>
    </div>
  );
}
