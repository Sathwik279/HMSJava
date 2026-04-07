import { useState } from 'react';

const AuthPane = ({ onLogin, onSignup, authMessage }) => {
  const [isLogin, setIsLogin] = useState(true);

  // Login state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginRole, setLoginRole] = useState('patient');

  // Signup state
  const [signupRole, setSignupRole] = useState('patient');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupAge, setSignupAge] = useState('');
  const [signupSpecialization, setSignupSpecialization] = useState('OPHTHALMOLOGY');
  const [signupMode, setSignupMode] = useState('ONLINE');
  const [signupStartTime, setSignupStartTime] = useState('09:00');
  const [signupEndTime, setSignupEndTime] = useState('17:00');
  const [signupHospitalName, setSignupHospitalName] = useState('');
  const [signupHospitalAddress, setSignupHospitalAddress] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    onLogin({ username: loginUsername, password: loginPassword, role: loginRole });
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    const payload = {
      role: signupRole,
      username: signupUsername,
      password: signupPassword,
      name: signupName,
      phone: signupPhone,
      age: signupAge,
      specialization: signupRole === 'doctor' ? signupSpecialization : null,
      mode: signupRole === 'doctor' ? signupMode : null,
      startTime: signupRole === 'doctor' ? signupStartTime : null,
      endTime: signupRole === 'doctor' ? signupEndTime : null,
      hospitalName: signupRole === 'doctor' ? signupHospitalName : null,
      hospitalAddress: signupRole === 'doctor' ? signupHospitalAddress : null,
    };
    onSignup(payload);
  };

  return (
    <div className="container animate-in" style={{ maxWidth: '500px', marginTop: '4rem' }}>
      <div className="glass card">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem' }}>HMS Pro</h1>
          <p style={{ color: 'var(--text-muted)' }}>Hospital Management System</p>
        </div>

        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: '2rem', gap: '0' }}>
          <button 
            className={`btn ${isLogin ? 'btn-primary' : 'btn-outline'}`}
            style={{ borderRadius: '0.75rem 0 0 0.75rem' }}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button 
            className={`btn ${!isLogin ? 'btn-primary' : 'btn-outline'}`}
            style={{ borderRadius: '0 0.75rem 0.75rem 0' }}
            onClick={() => setIsLogin(false)}
          >
            Signup
          </button>
        </div>

        {authMessage && (
          <div style={{ 
            padding: '1rem', 
            borderRadius: '0.75rem', 
            background: 'rgba(239, 68, 68, 0.1)', 
            color: '#ef4444',
            marginBottom: '1rem',
            fontSize: '0.875rem',
            textAlign: 'center'
          }}>
            {authMessage}
          </div>
        )}

        {isLogin ? (
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label>Login as</label>
              <select value={loginRole} onChange={(e) => setLoginRole(e.target.value)}>
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
              </select>
            </div>
            <div className="form-group">
              <label>Username</label>
              <input 
                type="text" 
                placeholder="Enter your username"
                value={loginUsername} 
                onChange={(e) => setLoginUsername(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                value={loginPassword} 
                onChange={(e) => setLoginPassword(e.target.value)} 
                required 
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Sign In</button>
          </form>
        ) : (
          <form onSubmit={handleSignupSubmit}>
            <div className="form-group">
              <label>Join as</label>
              <select value={signupRole} onChange={(e) => setSignupRole(e.target.value)}>
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
              </select>
            </div>
            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Username</label>
                <input type="text" value={signupUsername} onChange={(e) => setSignupUsername(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} required />
              </div>
            </div>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" value={signupName} onChange={(e) => setSignupName(e.target.value)} required />
            </div>

            {signupRole === 'patient' ? (
              <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Phone</label>
                  <input type="text" value={signupPhone} onChange={(e) => setSignupPhone(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Age</label>
                  <input type="number" value={signupAge} onChange={(e) => setSignupAge(e.target.value)} required />
                </div>
              </div>
            ) : (
              <>
                <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Specialization</label>
                    <select value={signupSpecialization} onChange={(e) => setSignupSpecialization(e.target.value)} required>
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
                  <div className="form-group">
                    <label>Mode</label>
                    <select value={signupMode} onChange={(e) => setSignupMode(e.target.value)} required>
                      <option value="ONLINE">Online</option>
                      <option value="OFFLINE">Offline</option>
                    </select>
                  </div>
                </div>
                <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Start Time</label>
                    <input type="time" value={signupStartTime} onChange={(e) => setSignupStartTime(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label>End Time</label>
                    <input type="time" value={signupEndTime} onChange={(e) => setSignupEndTime(e.target.value)} required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Hospital Name</label>
                  <input type="text" value={signupHospitalName} onChange={(e) => setSignupHospitalName(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Hospital Address</label>
                  <input type="text" value={signupHospitalAddress} onChange={(e) => setSignupHospitalAddress(e.target.value)} required />
                </div>
              </>
            )}
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create Account</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthPane;
