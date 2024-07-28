import React from 'react';
import './Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome to mediConnect</h1>
        <p>Your Health, Our Priority</p>
      </header>
      <nav className="dashboard-nav">
        <ul>
          <li>Home</li>
          <li>Appointments</li>
          <li>Medical Records</li>
          <li>Prescriptions</li>
          <li>Settings</li>
        </ul>
      </nav>
      <main className="dashboard-main">
        <section className="dashboard-section">
          <h2>Upcoming Appointments</h2>
          {/* Add details or a list of appointments here */}
        </section>
        <section className="dashboard-section">
          <h2>Recent Medical Records</h2>
          {/* Add a summary or list of medical records here */}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
