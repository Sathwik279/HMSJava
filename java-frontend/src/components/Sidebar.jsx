const Sidebar = ({ user, onLogout }) => {
  return (
    <div className="glass card animate-in" style={{ padding: '2rem', height: 'fit-content', position: 'sticky', top: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ 
          width: '4rem', 
          height: '4rem', 
          borderRadius: '1rem', 
          background: 'var(--primary)', 
          margin: '0 auto 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem'
        }}>
          {user.role === 'patient' ? '👤' : '🏥'}
        </div>
        <h3 style={{ margin: 0 }}>{user.username}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{user.role.toUpperCase()}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>
          <span>🏠</span> Dashboard
        </button>
        <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>
          <span>📅</span> Appointments
        </button>
        <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>
          <span>⚙️</span> Settings
        </button>
        <button 
          className="btn btn-primary" 
          style={{ marginTop: '2rem', background: '#ef4444', justifyContent: 'flex-start' }}
          onClick={onLogout}
        >
          <span>🚪</span> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
