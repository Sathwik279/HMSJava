const AppointmentList = ({ appointments, role, onCancel }) => {
  if (!appointments || appointments.length === 0) {
    return (
      <div className="glass card animate-in" style={{ textAlign: 'center', padding: '3rem' }}>
        <p style={{ color: 'var(--text-muted)' }}>No appointments found.</p>
      </div>
    );
  }

  return (
    <div className="glass card animate-in" style={{ padding: '1rem', overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>{role === 'patient' ? 'Doctor ID' : 'Patient ID'}</th>
            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Date</th>
            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Time</th>
            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Status</th>
            {role === 'patient' && <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Action</th>}
          </tr>
        </thead>
        <tbody>
          {appointments.map((app) => (
            <tr key={app.id} style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '1rem' }}>{role === 'patient' ? `Dr. ${app.doctorId}` : `Pat. ${app.patientId}`}</td>
              <td style={{ padding: '1rem' }}>{app.date}</td>
              <td style={{ padding: '1rem' }}>{app.time}</td>
              <td style={{ padding: '1rem' }}>
                <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.2)', color: 'var(--primary)' }}>
                  {app.status}
                </span>
              </td>
              {role === 'patient' && (
                <td style={{ padding: '1rem' }}>
                  <button 
                    className="btn btn-outline" 
                    style={{ 
                      padding: '0.25rem 0.75rem', 
                      fontSize: '0.75rem', 
                      borderColor: '#ef4444', 
                      color: '#ef4444' 
                    }}
                    onClick={() => onCancel(app.id)}
                  >
                    Cancel
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentList;
