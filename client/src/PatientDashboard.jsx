export default function PatientDashboard({ user, onFindDoctors, onMyAppointments, onLogout }) {
  const firstName = (user?.name || "Patient").split(" ")[0];
  return (
    <main style={{ minHeight: "80vh", background: "#f0f8f5", padding: "60px 20px" }}>
      <div className="container" style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ background: "linear-gradient(135deg, #063f43, #07867d)", color: "white", padding: "45px", borderRadius: 24, marginBottom: 35 }}>
          <p style={{ color: "#b9e8d9", fontWeight: 600 }}>✦ YOUR HEALTH, OUR PRIORITY</p>
          <h1 style={{ color: "white", fontSize: 42 }}>Welcome back, {firstName}!</h1>
          <p style={{ fontSize: 17, maxWidth: 650 }}>Your healthcare journey continues here. Find trusted doctors and manage your appointments in one convenient place.</p>
          <button type="button" className="btn btn-primary" onClick={onFindDoctors} style={{ marginTop: 20 }}>Find a doctor →</button>
        </div>
        <div style={{ marginBottom: 25 }}>
          <div className="eyebrow">YOUR PERSONAL SPACE</div>
          <h2>What would you like to do today?</h2>
          <p className="section-sub">Everything you need to manage your healthcare journey.</p>
        </div>
        <div className="dashboard-cards">
          <article className="dashboard-card"><div className="dashboard-icon">🩺</div><h3>Find Doctors</h3><p>Browse available doctors, explore their specialties, and choose the right care for you.</p><button type="button" className="btn btn-primary" onClick={onFindDoctors}>Explore doctors →</button></article>
          <article className="dashboard-card"><div className="dashboard-icon">📅</div><h3>My Appointments</h3><p>View your appointment requests and keep track of your upcoming consultations.</p><button type="button" className="btn btn-outline" onClick={onMyAppointments}>View appointments →</button></article>
          <article className="dashboard-card"><div className="dashboard-icon">👤</div><h3>My Account</h3><p>Signed in as: <strong style={{ display: "block", marginTop: 8 }}>{user?.email || "Patient account"}</strong></p><button type="button" className="btn btn-outline" onClick={onLogout}>Log out</button></article>
        </div>
      </div>
    </main>
  );
}
