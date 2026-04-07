import { useState, useEffect, useMemo } from 'react';
import './App.css';
import AuthPane from './components/AuthPane';
import Sidebar from './components/Sidebar';
import DoctorCard from './components/DoctorCard';
import AppointmentList from './components/AppointmentList';

const API_BASE = 'http://localhost:8123/api';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [mode, setMode] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [message, setMessage] = useState('');
  const [authMessage, setAuthMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        setIsLoggedIn(true);
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  useEffect(() => {
    if (user && isLoggedIn) {
      fetchDoctors();
      fetchAppointments();
    }
  }, [user, isLoggedIn]);

  const fetchDoctors = async () => {
    try {
      const response = await fetch(`${API_BASE}/doctors`);
      if (!response.ok) throw new Error('Failed to fetch doctors');
      const data = await response.json();
      setDoctors(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setDoctors([]);
    }
  };

  const fetchAppointments = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const profileId = user.profileId || user.userId;
      const endpoint = user.role === 'patient' 
        ? `${API_BASE}/appointments/patient/${profileId}`
        : `${API_BASE}/appointments/doctor/${profileId}`;
      
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error('Failed to fetch appointments');
      const data = await response.json();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setAppointments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDoctors = useMemo(() => {
    if (!Array.isArray(doctors)) return [];
    return doctors.filter((doctor) => {
      if (mode && doctor.mode !== mode) return false;
      if (specialization && doctor.specialization !== specialization) return false;
      return true;
    });
  }, [doctors, mode, specialization]);

  const handleLogin = async (credentials) => {
    setAuthMessage('');
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data);
        setIsLoggedIn(true);
        localStorage.setItem('user', JSON.stringify(data));
      } else {
        setAuthMessage(data.error || 'Login failed');
      }
    } catch (error) {
      setAuthMessage('Server connection failed. Please ensure the backend is running.');
    }
  };

  const handleSignup = async (payload) => {
    setAuthMessage('');
    try {
      const response = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok) {
        setAuthMessage('Account created successfully! You can now sign in.');
      } else {
        setAuthMessage(data.error || 'Signup failed');
      }
    } catch (error) {
      setAuthMessage('Server connection failed');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setDoctors([]);
    setAppointments([]);
    localStorage.removeItem('user');
  };

  const bookAppointment = async (doctorId, date, time) => {
    if (!date || !time) {
      setMessage('⚠️ Please select a valid date and time before booking.');
      return;
    }
    try {
      const profileId = user.profileId || user.userId;
      const response = await fetch(`${API_BASE}/appointments/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          patientId: profileId.toString(),
          doctorId: doctorId.toString(),
          date,
          time,
        }),
      });
      const resMessage = await response.text();
      setMessage(resMessage);
      fetchAppointments();
      setTimeout(() => setMessage(''), 6000);
    } catch (error) {
      setMessage('❌ Booking failed. Please try again later.');
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!confirm('Are you sure you want to cancel this appointment? This action cannot be undone.')) return;
    try {
      const response = await fetch(`${API_BASE}/appointments/${appointmentId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setMessage('✅ Appointment successfully cancelled and slot released.');
        fetchAppointments();
        setTimeout(() => setMessage(''), 6000);
      } else {
        setMessage('❌ Failed to cancel appointment.');
      }
    } catch (error) {
      setMessage('❌ Connection error during cancellation.');
    }
  };

  if (!isLoggedIn) {
    return <AuthPane onLogin={handleLogin} onSignup={handleSignup} authMessage={authMessage} />;
  }

  return (
    <div className="container" style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 300px) 1fr', gap: '2rem', padding: '2rem 0' }}>
      <Sidebar user={user} onLogout={handleLogout} />

      <main className="animate-in">
        <header style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>
            Welcome back, <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{user.username}</span>.
          </p>
        </header>

        {message && (
          <div className="glass" style={{ 
            marginBottom: '2rem', 
            padding: '1.25rem', 
            borderRadius: '1rem',
            background: message.includes('❌') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', 
            color: message.includes('❌') ? '#ef4444' : 'var(--secondary)', 
            border: `1px solid ${message.includes('❌') ? '#ef4444' : 'var(--secondary)'}`,
            animation: 'fadeIn 0.3s ease-out'
          }}>
            {message}
          </div>
        )}

        <section style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ margin: 0 }}>My Appointments</h2>
            <button className="btn btn-outline" onClick={fetchAppointments} disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Refresh Schedule'}
            </button>
          </div>
          <AppointmentList appointments={appointments} role={user.role} onCancel={handleCancelAppointment} />
        </section>

        {user.role === 'patient' && (
          <section className="animate-in">
            <h2 style={{ marginBottom: '2rem' }}>Available Specialists</h2>
            
            <div className="glass" style={{ marginBottom: '2.5rem', padding: '1.5rem', borderRadius: '1.25rem' }}>
              <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr', alignItems: 'end', gap: '1.5rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Consultation Mode</label>
                  <select value={mode} onChange={(e) => setMode(e.target.value)}>
                    <option value="">All Modes</option>
                    <option value="ONLINE">Online</option>
                    <option value="OFFLINE">Offline</option>
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Department</label>
                  <select value={specialization} onChange={(e) => setSpecialization(e.target.value)}>
                    <option value="">All Departments</option>
                    <option value="OPHTHALMOLOGY">Ophthalmology</option>
                    <option value="PAEDIATRICS">Paediatrics</option>
                    <option value="GYNAECOLOGY">Gynaecology</option>
                    <option value="CARDIOLOGY">Cardiology</option>
                    <option value="DERMATOLOGY">Dermatology</option>
                    <option value="NEUROLOGY">Neurology</option>
                    <option value="ORTHOPAEDICS">Orthopaedics</option>
                    <option value="PSYCHIATRY">Psychiatry</option>
                    <option value="GASTROENTEROLOGY">Gastroenterology</option>
                    <option value="UROLOGY">Urology</option>
                    <option value="GENERAL_SURGERY">General Surgery</option>
                    <option value="ENT">ENT</option>
                    <option value="DENTISTRY">Dentistry</option>
                    <option value="RADIOLOGY">Radiology</option>
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Preferred Date</label>
                  <input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Preferred Time</label>
                  <input type="time" value={bookingTime} onChange={(e) => setBookingTime(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map(doctor => (
                  <DoctorCard 
                    key={doctor.id} 
                    doctor={doctor} 
                    onBook={bookAppointment} 
                    role={user.role} 
                    bookingDate={bookingDate}
                    bookingTime={bookingTime}
                  />
                ))
              ) : (
                <div className="glass card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
                  <p style={{ color: 'var(--text-muted)' }}>No doctors match your current filters.</p>
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;