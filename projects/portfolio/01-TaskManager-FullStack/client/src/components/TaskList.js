import React from 'react';

function TaskList({ tasks, onToggle, onDelete }) {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ff4444';
      case 'medium': return '#ffaa00';
      case 'low': return '#44ff44';
      default: return '#aaa';
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <p>Aucune tâche à afficher</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <div
          key={task._id}
          className={`task-item ${task.completed ? 'completed' : ''}`}
        >
          <div className="task-content">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggle(task._id)}
              className="task-checkbox"
            />

            <div className="task-info">
              <h3 className="task-title">{task.title}</h3>
              {task.description && (
                <p className="task-description">{task.description}</p>
              )}
            </div>

            <div
              className="priority-badge"
              style={{ backgroundColor: getPriorityColor(task.priority) }}
            >
              {task.priority}
            </div>

            <button
              onClick={() => onDelete(task._id)}
              className="btn-delete"
              aria-label="Supprimer la tâche"
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TaskList;
