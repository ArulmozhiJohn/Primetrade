import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTasksAPI, createTaskAPI, updateTaskAPI, deleteTaskAPI } from '../api/tasks';

const STATUS_COLORS = {
  'pending':     '#f59e0b',
  'in-progress': '#3b82f6',
  'completed':   '#10b981',
};

export default function Dashboard() {
  const { user, logout }   = useAuth();
  const [tasks,   setTasks]   = useState([]);
  const [form,    setForm]    = useState({ title: '', description: '', status: 'pending' });
  const [editing, setEditing] = useState(null);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    try {
      const res = await getTasksAPI();
      setTasks(res.data.data);
    } catch { setError('Failed to load tasks'); }
  };

  const showMessage = (msg, isError = false) => {
    isError ? setError(msg) : setSuccess(msg);
    setTimeout(() => { setError(''); setSuccess(''); }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editing) {
        await updateTaskAPI(editing.id, form);
        showMessage('Task updated successfully!');
        setEditing(null);
      } else {
        await createTaskAPI(form);
        showMessage('Task created successfully!');
      }
      setForm({ title: '', description: '', status: 'pending' });
      fetchTasks();
    } catch (err) {
      showMessage(err.response?.data?.message || 'Operation failed', true);
    } finally { setLoading(false); }
  };

  const handleEdit = (task) => {
    setEditing(task);
    setForm({ title: task.title, description: task.description || '', status: task.status });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await deleteTaskAPI(id);
      showMessage('Task deleted!');
      fetchTasks();
    } catch { showMessage('Failed to delete task', true); }
  };

  const handleCancel = () => {
    setEditing(null);
    setForm({ title: '', description: '', status: 'pending' });
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <nav className="navbar">
        <h2>PrimeTrade</h2>
        <div className="nav-right">
          <span>user {user?.name} <em>({user?.role})</em></span>
          <button onClick={logout} className="btn-logout">Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        {/* Alerts */}
        {error   && <div className="alert error">{error}</div>}
        {success && <div className="alert success">{success}</div>}

        {/* Task Form */}
        <div className="card">
          <h3>{editing ? ' Edit Task' : '+ New Task'}</h3>
          <form onSubmit={handleSubmit} className="task-form">
            <input
              type="text" placeholder="Task title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <textarea
              placeholder="Description (optional)"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <div className="form-actions">
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Saving...' : editing ? 'Update Task' : 'Create Task'}
              </button>
              {editing && (
                <button type="button" onClick={handleCancel} className="btn-secondary">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Task List */}
        <div className="card">
          <h3> My Tasks ({tasks.length})</h3>
          {tasks.length === 0 ? (
            <p className="empty">No tasks yet. Create one above!</p>
          ) : (
            <div className="task-list">
              {tasks.map((task) => (
                <div key={task.id} className="task-item">
                  <div className="task-info">
                    <h4>{task.title}</h4>
                    {task.description && <p>{task.description}</p>}
                    <span
                      className="badge"
                      style={{ backgroundColor: STATUS_COLORS[task.status] }}
                    >
                      {task.status}
                    </span>
                  </div>
                  <div className="task-actions">
                    <button onClick={() => handleEdit(task)} className="btn-edit">Edit</button>
                    <button onClick={() => handleDelete(task.id)} className="btn-delete">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}