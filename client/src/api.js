const API_URL = "http://localhost:5000/api";

export async function registerUser(name, email, password) {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Registrasi gagal");
    }

    return data;
}

export async function loginUser(email, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Login gagal");
    }

    return data;
}

export async function createAppointment(
    token,
    doctor,
    appointmentDate,
    appointmentTime,
    reason = ""
) {
    const response = await fetch(`${API_URL}/appointments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            doctor,
            appointmentDate,
            appointmentTime,
            reason,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Booking gagal disimpan");
    }

    return data;
}

export async function getMyAppointments(token) {
    const response = await fetch(`${API_URL}/appointments/my`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Gagal mengambil appointment");
    }

    return data;
}

export async function cancelAppointment(token, appointmentId) {
    const response = await fetch(
        `${API_URL}/appointments/${appointmentId}/cancel`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Gagal membatalkan appointment");
    }

    return data;
}