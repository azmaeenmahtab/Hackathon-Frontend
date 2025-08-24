// src/components/AdminDashboard.js
import React, { useEffect, useState } from "react";
// import { apiFetch } from "../utils/fetchHelper";
import { useNavigate } from "react-router-dom";
export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);

  const navigate = useNavigate();

//   useEffect(() => {
//     loadStats();
//     loadEvents();
//   }, []);

  async function loadStats() {
    // const res = await apiFetch("/admin/stats");
    // setStats(await res.json());
    navigate("/admin/dashboard");
  }

  async function loadEvents() {
    // const res = await apiFetch("/events");
    // setEvents(await res.json());
    navigate("/admin/manage-events");
  }

//   async function loadRegistrations(eventId) {
    // const res = await apiFetch(`/admin/events/${eventId}/registrations`);
    // setRegistrations(await res.json());
    // setSelectedEvent(eventId);
//   }

//   async function markAttendance(regId) {
//     await apiFetch(`/events/${selectedEvent}/attendance`, {
//       method: "POST",
//       body: JSON.stringify({ registration_id: regId }),
//     });
//     loadRegistrations(selectedEvent);
//   }

//   async function generateCertificates(eventId) {
//     await apiFetch(`/events/${eventId}/certificates/generate`, { method: "POST" });
//     alert("Certificates generated!");
//     loadStats();
//   }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow p-4">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <ul className="space-y-3">
          <li><button onClick={loadStats}>Dashboard</button></li>
          <li><button onClick={loadEvents}>Manage Events</button></li>
        </ul>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white shadow rounded p-4">
            <h3 className="text-gray-500">Total Events</h3>
            <p className="text-2xl font-bold">{stats.totalEvents || 0}</p>
          </div>
          <div className="bg-white shadow rounded p-4">
            <h3 className="text-gray-500">Total Registrations</h3>
            <p className="text-2xl font-bold">{stats.totalRegistrations || 0}</p>
          </div>
          <div className="bg-white shadow rounded p-4">
            <h3 className="text-gray-500">Certificates Issued</h3>
            <p className="text-2xl font-bold">{stats.totalCertificates || 0}</p>
          </div>
        </div>

        {/* Events Table */}
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-bold mb-4">Your Events</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-2">Title</th>
                <th className="p-2">Date</th>
                <th className="p-2">Registrations</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((evt) => (
                <tr key={evt.id} className="border-b">
                  <td className="p-2">{evt.title}</td>
                  <td className="p-2">{new Date(evt.start_at).toLocaleDateString()}</td>
                  <td className="p-2">{evt.registration_count || 0}</td>
                  <td className="p-2">{evt.is_cancelled ? "Cancelled" : "Active"}</td>
                  <td className="p-2 space-x-2">
                    <button
                      className="px-3 py-1 bg-green-500 text-white rounded"
                      onClick={() => loadRegistrations(evt.id)}
                    >
                      View
                    </button>
                    <button
                      className="px-3 py-1 bg-indigo-500 text-white rounded"
                      onClick={() => generateCertificates(evt.id)}
                    >
                      Certificates
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Registrations Table */}
        {selectedEvent && (
          <div className="bg-white shadow rounded p-4 mt-6">
            <h2 className="text-lg font-bold mb-4">Registrations</h2>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="p-2">Student</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg) => (
                  <tr key={reg.id} className="border-b">
                    <td className="p-2">{reg.firebase_uid}</td>
                    <td className="p-2">{reg.status}</td>
                    <td className="p-2">
                      {reg.status !== "attended" && (
                        <button
                          className="px-3 py-1 bg-blue-500 text-white rounded"
                          onClick={() => markAttendance(reg.id)}
                        >
                          Mark Attended
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

