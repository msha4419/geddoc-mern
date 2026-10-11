import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api";

export default function MyAppointments({ token, onBack }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  async function loadAppointments() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/appointments/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Gagal mengambil appointment"
        );
      }

      setAppointments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) {
      loadAppointments();
    } else {
      setLoading(false);
      setError("Silakan login terlebih dahulu.");
    }
  }, [token]);

  async function handleCancel(id) {
    if (
      !window.confirm(
        "Yakin ingin membatalkan appointment ini?"
      )
    ) {
      return;
    }

    setCancellingId(id);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/appointments/${id}/cancel`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Gagal membatalkan appointment"
        );
      }

      await loadAppointments();
      alert("Appointment berhasil dibatalkan!");
    } catch (err) {
      setError(err.message);
    } finally {
      setCancellingId(null);
    }
  }

  // Style khusus halaman My Appointments.
  // Tidak menggunakan dashboard-card agar tidak
  // terkena aturan CSS dari halaman dashboard.
  const cardStyle = {
    backgroundColor: "#ffffff",
    border: "1px solid #dceae6",
    borderRadius: "18px",
    padding: "24px",
    boxShadow: "0 8px 24px rgba(0, 60, 55, 0.05)",
    height: "auto",
    minHeight: 0,
    display: "block",
    boxSizing: "border-box",
  };

  const infoStyle = {
    display: "block",
    margin: 0,
    padding: 0,
    height: "auto",
    minHeight: 0,
    lineHeight: "1.6",
    fontSize: "15px",
    color: "#365b60",
  };

  const buttonStyle = {
    marginTop: "18px",
    padding: "11px 16px",
    background: "#ffffff",
    border: "1px solid #b9d6cf",
    borderRadius: "9px",
    color: "#007f78",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
  };

  return (
    <main
      style={{
        minHeight: "80vh",
        background: "#f0f8f5",
        padding: "60px 20px",
      }}
    >
      <div
        className="container"
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <button
          type="button"
          className="btn btn-outline"
          onClick={onBack}
          style={{ marginBottom: "30px" }}
        >
          ← Back to Dashboard
        </button>

        <div className="eyebrow">
          YOUR APPOINTMENTS
        </div>

        <h1>My Appointments</h1>

        <p className="section-sub">
          View and manage your doctor appointments.
        </p>

        {loading && (
          <p>Loading appointments...</p>
        )}

        {error && (
          <p
            role="alert"
            style={{ color: "#b42318" }}
          >
            {error}
          </p>
        )}

        {!loading &&
          !error &&
          appointments.length === 0 && (
            <div
              style={{
                ...cardStyle,
                marginTop: "30px",
              }}
            >
              <h3>No appointments yet</h3>
              <p>
                You haven't booked any doctor
                appointments yet.
              </p>
            </div>
          )}

        {!loading &&
          appointments.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
                gap: "20px",
                marginTop: "30px",
                alignItems: "start",
              }}
            >
              {appointments.map((appointment) => (
                <article
                  key={appointment._id}
                  style={cardStyle}
                >
                  <div
                    className="eyebrow"
                    style={{
                      marginBottom: "10px",
                    }}
                  >
                    {appointment.doctor?.specialty ||
                      "DOCTOR APPOINTMENT"}
                  </div>

                  <h3
                    style={{
                      margin: "0 0 16px 0",
                      padding: 0,
                      color: "#123e45",
                      fontSize: "22px",
                      lineHeight: 1.4,
                    }}
                  >
                    {appointment.doctor?.name ||
                      "Doctor unavailable"}
                  </h3>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      alignItems: "stretch",
                      gap: "10px",
                      height: "auto",
                      minHeight: 0,
                    }}
                  >
                    <p style={infoStyle}>
                      <strong>Date:</strong>{" "}
                      {appointment.appointmentDate}
                    </p>

                    <p style={infoStyle}>
                      <strong>Time:</strong>{" "}
                      {appointment.appointmentTime}
                    </p>

                    <p style={infoStyle}>
                      <strong>Status:</strong>{" "}
                      <span
                        style={{
                          fontWeight: 700,
                          color:
                            appointment.status ===
                            "cancelled"
                              ? "#b42318"
                              : appointment.status ===
                                "confirmed"
                              ? "#07867d"
                              : "#b7791f",
                        }}
                      >
                        {appointment.status}
                      </span>
                    </p>

                    {appointment.reason && (
                      <p style={infoStyle}>
                        <strong>Notes:</strong>{" "}
                        {appointment.reason}
                      </p>
                    )}
                  </div>

                  {appointment.status === "pending" && (
                    <button
                      type="button"
                      style={buttonStyle}
                      disabled={
                        cancellingId ===
                        appointment._id
                      }
                      onClick={() =>
                        handleCancel(
                          appointment._id
                        )
                      }
                    >
                      {cancellingId ===
                      appointment._id
                        ? "Cancelling..."
                        : "Cancel Appointment"}
                    </button>
                  )}
                </article>
              ))}
            </div>
          )}
      </div>
    </main>
  );
}
