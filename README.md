# Geddoc – Doctor Appointment Booking Application

## Project Overview

Geddoc is a full-stack doctor appointment booking web application developed using the MERN stack (MongoDB, Express.js, React.js, and Node.js).

The application is designed to simplify the process of finding doctors and booking medical appointments. Patients can create an account, log in, browse available doctors, view doctor details, submit appointment requests, and manage their appointments through a user-friendly interface.

This project was developed as part of the **Book a Doctor App Capstone Project**.

## Technologies Used

| Technology | Purpose |
|---|---|
| MongoDB Atlas | Cloud database for storing application data |
| Express.js | Backend API framework |
| React.js | Frontend user interface |
| Node.js | Backend JavaScript runtime |
| Mongoose | MongoDB object data modeling |
| Vite | React development and build tool |
| JWT | User authentication |
| CSS | Application styling |
| Git & GitHub | Version control and source code management |

## Main Features

### 1. Patient Registration

New patients can register by providing their name, email address, and password.

### 2. Patient Login and Logout

Registered patients can log in to access their dashboard and log out when they finish using the application.

### 3. Patient Dashboard

After logging in, patients can access a dashboard containing navigation to Find Doctors, My Appointments, and account information.

### 4. Find Doctors

Patients can browse a list of doctors retrieved from MongoDB Atlas. Doctor profiles include information such as name, specialization, experience, and consultation fee.

### 5. Doctor Details

Patients can view additional information about a selected doctor before booking an appointment.

### 6. Book an Appointment

Authenticated patients can submit appointment requests by selecting a doctor, appointment date, appointment time, and optional consultation notes.

New appointment requests are initially assigned a **pending** status.

### 7. My Appointments

Patients can view their appointment history, including doctor information, appointment date, time, notes, and booking status.

### 8. Cancel Appointment

Patients can cancel their pending appointment requests. Cancelled appointments remain visible in their appointment history with a **cancelled** status.

## Project Structure

```text
geddoc-mern/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── PatientDashboard.jsx
│   │   ├── MyAppointments.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── models/
│   │   ├── User.js
│   │   ├── Doctor.js
│   │   └── Appointment.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── doctorRoutes.js
│   │   └── appointmentRoutes.js
│   ├── seedDoctors.js
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

## Installation and Setup

### Prerequisites

Before running this application, ensure that the following are available:

- Node.js and npm
- MongoDB Atlas database
- Git
- Visual Studio Code or another code editor

### 1. Clone the Repository

```bash
git clone https://github.com/msha4419/geddoc-mern.git
cd geddoc-mern
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `server` directory and configure the required environment variables:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_jwt_secret
```

Replace the placeholder values with your own credentials.

**Security Note:** Never commit the `.env` file, database credentials, or JWT secret to GitHub.

### 4. Start the Backend Server

From the `server` directory, run:

```bash
node server.js
```

The backend runs at:

```text
http://localhost:5000
```

### 5. Install Frontend Dependencies

Open another terminal and run:

```bash
cd client
npm install
```

### 6. Start the Frontend

From the `client` directory, run:

```bash
npm run dev
```

Open the local URL displayed by Vite, typically:

```text
http://localhost:5173
```

## API Endpoints

The backend provides REST API endpoints for patient authentication, doctor information, and appointment management.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a patient |
| POST | `/api/auth/login` | Log in a patient |
| GET | `/api/doctors` | Retrieve available doctors |
| GET | `/api/appointments/my` | Retrieve the authenticated patient's appointments |
| POST | `/api/appointments` | Create an appointment request |
| PATCH | `/api/appointments/:id/cancel` | Cancel a pending appointment |

Protected appointment endpoints require a valid JWT in the Authorization header.

## Application Workflow

1. A patient opens the Geddoc application.
2. The patient registers an account or logs in.
3. The patient accesses the dashboard.
4. The patient browses available doctors.
5. The patient selects a doctor and views their details.
6. The patient chooses an appointment date and time.
7. The patient submits an appointment request.
8. The request is saved in MongoDB with a pending status.
9. The patient views the booking through My Appointments.
10. The patient may cancel a pending appointment if necessary.

## Database

Geddoc uses MongoDB Atlas as its cloud database.

The application uses three main data models:

**User:** Stores registered patient account information.

**Doctor:** Stores doctor profiles, specialties, experience, and consultation information.

**Appointment:** Stores appointment requests and connects patients with selected doctors.

Appointment statuses include:

- `pending`
- `confirmed`
- `cancelled`

## Project Scope

The current version focuses on patient-side appointment booking and management.

Doctor dashboards, administrator dashboards, online payments, notifications, and automatic appointment availability checks are outside the scope of this prototype.

Appointment time selections are provisional and are not automatically checked against a doctor's availability.

## Future Improvements

Potential future enhancements include:

- Doctor and administrator dashboards
- Real-time appointment availability
- Appointment approval and scheduling
- Email or SMS notifications
- Appointment search and filtering
- Online payment integration
- Deployment to a public hosting platform

## Repository

GitHub: https://github.com/msha4419/geddoc-mern

## Project Status

The patient-side core functionality has been implemented and tested locally. Further documentation and demonstration preparation are part of the capstone completion process.

---

**Geddoc – Making doctor appointment booking simpler and more accessible.**