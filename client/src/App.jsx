import { useEffect, useMemo, useState } from "react";

import "./App.css";

import { loginUser, registerUser } from "./api";

import PatientDashboard from "./PatientDashboard";
 import MyAppointments from "./MyAppointments";

export default function App() {

  const [authMode, setAuthMode] = useState(null);

const [authName, setAuthName] = useState("");

const [authEmail, setAuthEmail] = useState("");

const [authPassword, setAuthPassword] = useState("");

const [authError, setAuthError] = useState("");

const [authLoading, setAuthLoading] = useState(false);

const [currentUser, setCurrentUser] = useState(null);

const [currentPage, setCurrentPage] = useState("home");

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingNote, setBookingNote] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  async function handleBooking(event) {
    event.preventDefault();
    setBookingError("");
    if (!currentUser) {
      setSelectedDoctor(null);
      setBookingOpen(false);
      setAuthMode("login");
      return;
    }
    const token = sessionStorage.getItem("geddoc_token");
    if (!token) {
      setBookingError("Sesi login tidak tersedia. Silakan login kembali.");
      return;
    }
    setBookingLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
        doctor: selectedDoctor._id,
        appointmentDate: bookingDate,
        appointmentTime: bookingTime,
        reason: bookingNote}),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "Booking belum dapat disimpan. Periksa endpoint /api/appointments di backend.");
      alert("Permintaan appointment berhasil dikirim!");
      setSelectedDoctor(null);
      setBookingOpen(false);
      setBookingDate("");
      setBookingTime("");
      setBookingNote("");
    } catch (err) {
      setBookingError(err.message || "Gagal terhubung ke server.");
    } finally {
      setBookingLoading(false);
    }
  }

  const [doctors, setDoctors] = useState([]);

  const [name, setName] = useState("");

  const [specialty, setSpecialty] = useState("");

  const [location, setLocation] = useState("");

  const [filters, setFilters] = useState({ name: "", specialty: "", location: "" });

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");



  useEffect(() => {

    fetch("http://localhost:5000/api/doctors")

      .then((response) => { if (!response.ok) throw new Error("Failed to load doctors"); return response.json(); })

      .then(setDoctors)

      .catch((err) => setError(err.message))

      .finally(() => setLoading(false));

  }, []);



  const filteredDoctors = useMemo(() => doctors.filter((doctor) =>

    doctor.name.toLowerCase().includes(filters.name.toLowerCase()) &&

    (!filters.specialty || doctor.specialization === filters.specialty) &&

    (!filters.location || (doctor.hospital || "").toLowerCase().includes(filters.location.toLowerCase()))

  ), [doctors, filters]);



  function handleSearch(event) {

    event.preventDefault();

    setFilters({ name, specialty, location });

    document.getElementById("doctors")?.scrollIntoView({ behavior: "smooth" });

  }

async function handleAuth(event) {

  event.preventDefault();

  setAuthError("");

  setAuthLoading(true);



  try {

    if (authMode === "register") {

      await registerUser(authName, authEmail, authPassword);

      setAuthMode("login");

      setAuthPassword("");

      alert("Registrasi berhasil! Silakan login.");

    } else {

      const data = await loginUser(authEmail, authPassword);



      if (!data.token) {

        throw new Error("Token login tidak diterima");

      }



      sessionStorage.setItem("geddoc_token", data.token);

      setCurrentUser(data.user || { email: authEmail });

setCurrentPage("dashboard");

setAuthMode(null);

setAuthPassword("");

    }

  } catch (err) {

    setAuthError(err.message);

  } finally {

    setAuthLoading(false);

  }

}

  return (

    <>



<div className="topbar">✦ Your health journey, made simpler — Welcome to Geddoc</div>

<header className="navbar"><div className="container nav-inner"><a href="/" className="logo"><span className="logo-mark">✚</span>geddoc<span style={{ color: "#e9a55e" }}>.</span></a><nav className="nav-links"><a href="#specialties">Specialties</a><a href="#how-it-works">How it works</a><a href="#about">About us</a><a href="#faq">FAQ</a></nav><div className="nav-actions">{currentUser ? (

  <>

    <span style={{ fontWeight: 600, color: "#123b40" }}>

      Hi, {currentUser.name || currentUser.email}

    </span>



    <button

      type="button"

      className="btn btn-outline"

      onClick={() => {

        sessionStorage.removeItem("geddoc_token");

        setCurrentUser(null);
        setCurrentPage("home");

      }}

    >

      Log out

    </button>

  </>

) : (

  <>

    <button

      type="button"

      className="btn btn-outline"

      onClick={() => {

        setAuthError("");

        setAuthMode("login");

      }}

    >

      Log in

    </button>



    <button

      type="button"

      className="btn btn-primary"

      onClick={() => {

        setAuthError("");

        setAuthMode("register");

      }}

    >

      Get started ↗

    </button>

  </>

)}</div></div></header>

{currentPage === "dashboard" && currentUser ? (
  <PatientDashboard
    user={currentUser}
    onFindDoctors={() => {
      setCurrentPage("home");
      setTimeout(() => {
        document
          .getElementById("doctors")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 0);
    }}
    onMyAppointments={() => setCurrentPage("appointments")}
    onLogout={() => {
      sessionStorage.removeItem("geddoc_token");
      setCurrentUser(null);
      setCurrentPage("home");
    }}
  />
) : currentPage === "appointments" && currentUser ? (
  <MyAppointments
    token={sessionStorage.getItem("geddoc_token")}
    onBack={() => setCurrentPage("dashboard")}
  />
) : (
<main>

<section className="hero"><div className="container hero-grid"><div><div className="eyebrow">✦ Healthcare made human</div><h1>Better care starts with <em>the right doctor.</em></h1><p>Find the care you need, discover trusted healthcare professionals, and plan your next appointment with less hassle.</p><div className="hero-buttons"><a href="#find-doctor" className="btn btn-primary">Find a doctor →</a><a href="#how-it-works" className="btn btn-outline">How Geddoc works ↗</a></div><p style={{ fontSize: 12, marginTop: 24 }}>✓ Simple search &nbsp; ✓ Clear booking flow &nbsp; ✓ Patient-first design</p></div><div className="hero-art"><img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=85" alt="Healthcare professional" /><div className="floating float-left"><span className="dot">●</span> Appointment planning made easy</div><div className="floating float-right">✚ Care that fits your schedule</div></div></div></section>

<div className="container search-wrap" id="find-doctor"><form className="search-panel" onSubmit={handleSearch} ><div className="field"><label htmlFor="name">Doctor name</label><input id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Search a doctor..." /></div><div className="field"><label htmlFor="specialty">Specialty</label><select id="specialty" name="specialty" value={specialty} onChange={(e) => setSpecialty(e.target.value)}><option value="">All specialties</option><option value="Dokter Umum">General Medicine</option><option value="Jantung">Cardiology</option><option value="Kulit dan Kelamin">Dermatology</option><option value="Dokter Anak">Pediatrics</option><option value="Penyakit Dalam">Internal Medicine</option></select></div><div className="field"><label htmlFor="location">Location</label><input id="location" name="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City or clinic" /></div><button className="btn btn-primary" type="submit">Search doctors →</button></form></div>

<section className="section" id="specialties"><div className="container"><div className="section-head"><div><div className="eyebrow">Find your care</div><h2>Explore by specialty</h2><p className="section-sub">Start with the kind of care you need. More specialties can be added as Geddoc grows.</p></div><a href="#doctors" className="btn btn-light">Browse all doctors →</a></div><div className="cards"><a className="specialty" href="#doctors" onClick={() => { setSpecialty("Dokter Umum"); setFilters({ name: "", specialty: "Dokter Umum", location: "" }); }}><div className="symbol">🩺</div><h3>General Medicine</h3><p>Everyday health concerns and routine consultations.</p></a><a className="specialty" href="#doctors" onClick={() => { setSpecialty("Jantung"); setFilters({ name: "", specialty: "Jantung", location: "" }); }}><div className="symbol">🫀</div><h3>Cardiology</h3><p>Heart health and cardiovascular consultations.</p></a><a className="specialty" href="#doctors" onClick={() => { setSpecialty("Kulit dan Kelamin"); setFilters({ name: "", specialty: "Kulit dan Kelamin", location: "" }); }}><div className="symbol">🌿</div><h3>Dermatology</h3><p>Skin, hair, and related health concerns.</p></a><a className="specialty" href="#doctors" onClick={() => { setSpecialty("Dokter Anak"); setFilters({ name: "", specialty: "Dokter Anak", location: "" }); }}><div className="symbol">🧸</div><h3>Pediatrics</h3><p>Dedicated healthcare for children and families.</p></a></div></div></section>

<section className="section results-section" id="doctors"><div className="container"><div className="section-head"><div><div className="eyebrow">Our medical team</div><h2>Available doctors</h2><p className="section-sub">Doctor profiles loaded from MongoDB Atlas.</p></div></div>{loading && <p className="status">Loading doctors...</p>}{error && <p className="status" role="alert">{error}</p>}{!loading && !error && filteredDoctors.length === 0 && <p className="status">No matching doctors found.</p>}<div className="doctor-results">{filteredDoctors.map((doctor) => <article className="result-card" key={doctor._id}><div className="eyebrow">{doctor.specialization}</div><h3>{doctor.name}</h3><p>{doctor.hospital}</p><p>{doctor.experience} years of experience</p><div className="fee">Rp {Number(doctor.consultationFee || 0).toLocaleString("id-ID")}</div><p>Consultation fee</p><button type="button" className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => { setSelectedDoctor(doctor); setBookingOpen(false); setBookingError(""); }}>View Details →</button></article>)}</div></div></section>

<section className="section section-soft" id="how-it-works"><div className="container"><div className="eyebrow">Three simple steps</div><h2>Care, without the confusion.</h2><p className="section-sub">An easier way to plan an appointment, from discovery to confirmation.</p><div className="steps" style={{ marginTop: 32 }}><div className="step"><span className="step-num">01 / DISCOVER</span><h3>Find your doctor</h3><p>Browse healthcare professionals and explore their specialties and profiles.</p></div><div className="step"><span className="step-num">02 / SCHEDULE</span><h3>Choose a time</h3><p>View available appointment slots and select the time that works for you.</p></div><div className="step"><span className="step-num">03 / MANAGE</span><h3>Stay organized</h3><p>Track booking status and manage upcoming appointments in one place.</p></div></div></div></section>

<section className="section" id="about"><div className="container about-grid"><div className="about-visual"><div className="illustration">🩺</div><div className="mini">Care should feel simple. ✨</div></div><div><div className="eyebrow">Meet Geddoc</div><h2>Built around people, not paperwork.</h2><p className="section-sub">Geddoc is a web-based doctor appointment booking project designed to make discovering doctors and arranging outpatient consultations more convenient. We aim to reduce scheduling uncertainty and make essential appointment information easier to access.</p><div className="check"><span>✓</span> Patient-friendly experience</div><div className="check"><span>✓</span> Straightforward appointment planning</div><div className="check"><span>✓</span> A connected experience for patients and doctors</div><a className="btn btn-light" href="#how-it-works" style={{ marginTop: 17 }}>Explore how it works →</a></div></div></section>

<section className="section section-soft" id="faq"><div className="container"><div className="eyebrow" style={{ textAlign: "center" }}>Good to know</div><h2 style={{ textAlign: "center" }}>Frequently asked questions</h2><div className="faq"><details><summary>What is Geddoc?</summary><p>Geddoc is a developing web application for discovering doctors and managing outpatient appointment requests.</p></details><details><summary>How will booking work?</summary><p>Once the booking module is implemented, patients will be able to sign in, choose a doctor and available slot, and track their appointment status.</p></details><details><summary>Can I manage my appointments?</summary><p>Appointment history, rescheduling and cancellation are planned features and will become available as development progresses.</p></details><details><summary>Is this already a live healthcare service?</summary><p>No. This is currently an academic software development prototype, not a live medical service. Please do not submit real patient information.</p></details></div></div></section>

<section className="section"><div className="container"><div className="cta"><div className="eyebrow" style={{ color: "#a4e9d4" }}>Your next step to better care</div><h2>Healthcare, a little easier.</h2><p>Explore the Geddoc experience as we build a simpler way to book doctor appointments.</p><a href="#find-doctor" className="btn">Explore doctors →</a></div></div></section>

</main>
)}
<footer className="footer"><div className="container"><div className="footer-grid"><div><a href="/" className="logo">✚ geddoc.</a><p style={{ lineHeight: 1.8, maxWidth: 350 }}>A patient-centered doctor booking application prototype, created to make appointment planning simpler and clearer.</p></div><div><h4>Explore</h4><a href="#specialties">Specialties</a><a href="#how-it-works">How it works</a><a href="#about">About Geddoc</a></div><div><h4>Support</h4><a href="#faq">FAQs</a><a href="#" onClick={(event) => { event.preventDefault(); setAuthError(""); setAuthMode("login"); }}>Patient login</a><button

  type="button"

  className="btn btn-primary"

  onClick={() => {

    setAuthError("");

    setAuthMode("register");

  }}

>

  Get started ↗

</button></div></div><div className="copyright">© 2026 Geddoc. Academic project prototype. Not a live healthcare provider.</div></div></footer>

 {selectedDoctor && (
  <div role="presentation" onClick={() => { setSelectedDoctor(null); setBookingOpen(false); }} style={{ position: "fixed", inset: 0, background: "rgba(0,35,38,.65)", zIndex: 9998, display: "flex", justifyContent: "center", alignItems: "center", padding: 20 }}>
    <section role="dialog" aria-modal="true" aria-label="Doctor details" onClick={(event) => event.stopPropagation()} style={{ width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto", background: "white", borderRadius: 22, padding: 30, position: "relative" }}>
      <button type="button" aria-label="Close" onClick={() => { setSelectedDoctor(null); setBookingOpen(false); }} style={{ position: "absolute", right: 20, top: 15, border: 0, background: "none", fontSize: 28, cursor: "pointer" }}>×</button>
      <div className="eyebrow">{selectedDoctor.specialization}</div>
      <h2 style={{ marginTop: 12 }}>{selectedDoctor.name}</h2>
      <p>{selectedDoctor.hospital}</p>
      <p>{selectedDoctor.experience} years of experience</p>
      <p>{selectedDoctor.description || "Trusted healthcare professional at Geddoc Medical Center."}</p>
      <p className="fee">Rp {Number(selectedDoctor.consultationFee || 0).toLocaleString("id-ID")}</p>
      {!bookingOpen ? (
        <button type="button" className="btn btn-primary" onClick={() => { if (!currentUser) { setSelectedDoctor(null); setAuthMode("login"); } else { setBookingOpen(true); } }}>Book Appointment →</button>
      ) : (
        <form onSubmit={handleBooking} style={{ marginTop: 18 }}>
          <h3>Book an appointment</h3>
          <div className="field"><label htmlFor="booking-date">Appointment date</label><input id="booking-date" type="date" min={new Date().toLocaleDateString("en-CA")} value={bookingDate} onChange={(event) => setBookingDate(event.target.value)} required /></div>
          <div className="field"><label htmlFor="booking-time">Appointment time</label><select id="booking-time" value={bookingTime} onChange={(event) => setBookingTime(event.target.value)} required><option value="">Choose a time</option><option value="09:00">09:00</option><option value="10:00">10:00</option><option value="11:00">11:00</option><option value="13:00">13:00</option><option value="14:00">14:00</option><option value="15:00">15:00</option></select></div>
          <div className="field"><label htmlFor="booking-notes">Notes (optional)</label><textarea id="booking-notes" value={bookingNote} onChange={(event) => setBookingNote(event.target.value)} placeholder="Reason for consultation" rows={3} style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #d7e6e1" }} /></div>
          <p style={{ fontSize: 13, color: "#60787a" }}>Time options are provisional and are not yet checked for availability.</p>
          {bookingError && <p role="alert" style={{ color: "#b42318" }}>{bookingError}</p>}
          <button type="submit" className="btn btn-primary" disabled={bookingLoading}>{bookingLoading ? "Saving..." : "Confirm booking"}</button>
          <button type="button" className="btn btn-outline" style={{ marginLeft: 8 }} onClick={() => { setBookingOpen(false); setBookingError(""); }}>Back</button>
        </form>
      )}
    </section>
  </div>
)}
{authMode && (

  <div

    style={{

      position: "fixed",

      inset: 0,

      background: "rgba(0, 35, 38, 0.65)",

      display: "flex",

      alignItems: "center",

      justifyContent: "center",

      zIndex: 9999,

      padding: 20,

    }}

  >

    <div

      style={{

        background: "white",

        padding: 35,

        borderRadius: 20,

        width: "100%",

        maxWidth: 420,

        position: "relative",

      }}

    >

      <button

        type="button"

        onClick={() => setAuthMode(null)}

        style={{

          position: "absolute",

          top: 15,

          right: 20,

          border: "none",

          background: "none",

          fontSize: 25,

          cursor: "pointer",

        }}

      >

        ×

      </button>



      <h2>

        {authMode === "login"

          ? "Welcome back!"

          : "Create your account"}

      </h2>



      <p>

        {authMode === "login"

          ? "Log in to continue your Geddoc journey."

          : "Join Geddoc to start booking appointments."}

      </p>



      <form onSubmit={handleAuth}>

        {authMode === "register" && (

          <div className="field">

            <label>Full name</label>

            <input

              value={authName}

              onChange={(e) => setAuthName(e.target.value)}

              required

              placeholder="Your full name"

            />

          </div>

        )}



        <div className="field">

          <label>Email address</label>

          <input

            type="email"

            value={authEmail}

            onChange={(e) => setAuthEmail(e.target.value)}

            required

            placeholder="you@example.com"

          />

        </div>



        <div className="field">

          <label>Password</label>

          <input

            type="password"

            value={authPassword}

            onChange={(e) => setAuthPassword(e.target.value)}

            required

            minLength={6}

            placeholder="Enter your password"

          />

        </div>



        {authError && (

          <p style={{ color: "#c0392b" }} role="alert">

            {authError}

          </p>

        )}



        <button

          type="submit"

          className="btn btn-primary"

          disabled={authLoading}

          style={{ width: "100%", marginTop: 15 }}

        >

          {authLoading

            ? "Please wait..."

            : authMode === "login"

              ? "Log in"

              : "Create account"}

        </button>

      </form>



      <p style={{ marginTop: 20, textAlign: "center" }}>

        {authMode === "login"

          ? "Don't have an account?"

          : "Already have an account?"}{" "}

        <button

          type="button"

          onClick={() => {

            setAuthError("");

            setAuthMode(

              authMode === "login" ? "register" : "login"

            );

          }}

          style={{

            border: "none",

            background: "none",

            color: "#00877f",

            cursor: "pointer",

            fontWeight: "bold",

          }}

        >

          {authMode === "login" ? "Register" : "Log in"}

        </button>

      </p>

    </div>

  </div>

)}

    </>

  );

}
