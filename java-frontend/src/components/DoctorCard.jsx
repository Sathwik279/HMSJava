const DoctorCard = ({ doctor, onBook, role, bookingDate, bookingTime }) => {
  return (
    <div className="glass card animate-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ margin: 0, color: 'var(--primary)' }}>Dr. {doctor.name}</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{doctor.specialization}</p>
        </div>
        <span className={`badge ${doctor.mode === 'ONLINE' ? 'badge-online' : 'badge-offline'}`}>
          {doctor.mode}
        </span>
      </div>
      
      <div style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span>🏥</span>
          <span>{doctor.hospitalName} - {doctor.hospitalAddress}</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <span>🕒</span>
          <span>{doctor.startTime} - {doctor.endTime}</span>
        </div>
      </div>

      {role === 'patient' && (
        <button 
          className="btn btn-primary" 
          style={{ width: '100%' }}
          onClick={() => onBook(doctor.id, bookingDate, bookingTime)}
        >
          Book Appointment
        </button>
      )}
    </div>
  );
};

export default DoctorCard;
