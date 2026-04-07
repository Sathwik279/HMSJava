import { useState, useEffect, useMemo } from 'react';
import './App.css';
import AuthPane from './components/AuthPane';
import Sidebar from './components/Sidebar';
import DoctorCard from './components/DoctorCard';
import AppointmentList from './components/AppointmentList';

const API_BASE = 'http://localhost:8080/api';

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

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchDoctors();
      fetchAppointments();
    }
  }, [user]);

  const fetchDoctors = async () => {
    try {
      const response = await fetch(`${API_BASE}/doctors`);
      const data = await response.json();
      setDoctors(data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const fetchAppointments = async () => {
    if (!user) return;
    try {
      const endpoint = user.role === 'patient' 
        ? `${API_BASE}/appointments/patient/${user.userId}`
        : `${API_BASE}/appointments/doctor/${user.userId}`;
      const response = await fetch(endpoint);
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      if (mode && doctor.mode !== mode) return false;
      if (specialization && doctor.specialization !== specialization) return false;
      return true;
    });
  }, [doctors, mode, specialization]);

  const handleLogin = async (credentials) => {
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
        setAuthMessage('');
      } else {
        setAuthMessage(data.error || 'Login failed');
      }
    } catch (error) {
      setAuthMessage('Server connection failed');
    }
  };

  const handleSignup = async (payload) => {
    try {
      const response = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok) {
        setAuthMessage('Account created! Sign in now.');
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
    localStorage.removeItem('user');
  };

  const bookAppointment = async (doctorId, date, time) => {
    if (!date || !time) {
      setMessage('⚠️ Please select a valid date and time.');
      return;
    }
    try {
      const response = await fetch(`${API_BASE}/appointments/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          patientId: user.userId.toString(),
          doctorId: doctorId.toString(),
          date,
          time,
        }),
      });
      const resMessage = await response.text();
      setMessage(resMessage);
      fetchAppointments();
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      setMessage('❌ Booking failed');
    }
  };

  if (!isLoggedIn) {
    return <AuthPane onLogin={handleLogin} onSignup={handleSignup} authMessage={authMessage} />;
  }

  return (
    <div className="container" style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 300px) 1fr', gap: '2rem' }}>
      <Sidebar user={user} onLogout={handleLogout} />

      <main className="animate-in">
        <header style={{ marginBottom: '3rem' }}>
          <h1>Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Welcome back, {user.username}. Here's what's happening today.</p>
        </header>

        {message && (
          <div className="glass" style={{ marginBottom: '2rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--secondary)', border: '1px solid var(--secondary)' }}>
            {message}
          </div>
        )}

        <section style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ margin: 0 }}>My Appointments</h2>
            <button className="btn btn-outline" onClick={fetchAppointments}>Refresh</button>
          </div>
          <AppointmentList appointments={appointments} role={user.role} />
        </section>

        {user.role === 'patient' && (
          <section className="animate-in">
            <h2 style={{ marginBottom: '2rem' }}>Available Specialists</h2>
            
            <div className="glass" style={{ marginBottom: '2.5rem', padding: '1.5rem' }}>
              <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr', alignItems: 'end', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Mode</label>
                  <select value={mode} onChange={(e) => setMode(e.target.value)}>
                    <option value="">All Modes</option>
                    <option value="ONLINE">Online</option>
                    <option value="OFFLINE">Offline</option>
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Specialization</label>
                  <select value={specialization} onChange={(e) => setSpecialization(e.target.value)}>
                    <option value="">All Specs</option>
                    <option value="OPHTHALMOLOGY">Ophthalmology</option>
                    <option value="PAEDIATRICS">Paediatrics</option>
                    <option value="GYNAECOLOGY">Gynaecology</option>
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

            <div className="grid">
              {filteredDoctors.map(doctor => (
                <DoctorCard 
                  key={doctor.id} 
                  doctor={doctor} 
                  onBook={bookAppointment} 
                  role={user.role} 
                  bookingDate={bookingDate}
                  bookingTime={bookingTime}
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;