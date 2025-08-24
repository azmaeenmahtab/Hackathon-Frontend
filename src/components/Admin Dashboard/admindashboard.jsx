// src/components/AdminDashboard.js
import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

// Card component for events (premium style)
const EventCard = ({ event, onView, onCertificates }) => (
  <div className="rounded-xl border border-blue-100 bg-white p-6 shadow hover:shadow-xl transition flex flex-col gap-2 min-w-[300px]">
    <div className="flex items-center justify-between mb-2">
      <span className="text-2xl">🎉</span>
      <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${event.is_cancelled ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>{event.is_cancelled ? 'Cancelled' : 'Active'}</span>
    </div>
    <div className="font-bold text-lg text-gray-900">{event.title}</div>
    <div className="text-gray-500 text-sm mb-2">{event.description}</div>
    <div className="text-xs text-gray-400 mb-1">{new Date(event.start_at).toLocaleString()} - {new Date(event.end_at).toLocaleString()}</div>
    <div className="text-xs text-gray-400 mb-3">Capacity: {event.max_capacity || 'Unlimited'} | Registrations: {event.registration_count || 0}</div>
    <div className="flex gap-2 mt-auto">
      <button onClick={() => onView(event.id)} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition">View Attendees</button>
      <button onClick={() => onCertificates(event.id)} className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">Certificates</button>
    </div>
  </div>
);

export default function AdminDashboard() {
 

  const [stats, setStats] = useState({});
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);

  const navigate = useNavigate();

// Replace the functions in your AdminDashboard component with these:

useEffect(() => {
  loadStats();
  loadEvents();
}, []);

  async function loadStats() {
    try {
      const uid = localStorage.getItem("uid");
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user");
      const token = await user.getIdToken();
      console.log("User token in the admin dashboard:", token);
      const res = await fetch("http://localhost:4000/api/admin/stats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ uid })
      });
      const data = await res.json();
      setStats(data);
    } catch (e) {
      console.error(e);
      setStats({});
    }
  setSelectedEvent(null);
  }

  async function loadEvents() {
    try {
      const uid = localStorage.getItem("uid");
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user");
      const token = await user.getIdToken();
      const res = await fetch("http://localhost:4000/api/admin/events-all", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ uid })
      });
      const data = await res.json();
      setEvents(data);
    } catch (e) {
      console.error(e);
      setEvents([]);
    }
  setSelectedEvent(null);
  }

  async function loadRegistrations(eventId) {
    try {
      const uid = localStorage.getItem("uid");
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user");
      const token = await user.getIdToken();
      const res = await fetch(`http://localhost:4000/api/events/${eventId}/registrations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ uid })
      });
      const data = await res.json();
      setRegistrations(data);
    } catch (e) {
      console.error(e);
      setRegistrations([]);
    }
    setSelectedEvent(eventId);
  }

  async function markAttendance(regId) {
    try {
      const uid = localStorage.getItem("uid");
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user");
      const token = await user.getIdToken();
      await fetch(`http://localhost:4000/api/registrations/${regId}/attendance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ uid })
      });
      if (selectedEvent) loadRegistrations(selectedEvent);
    } catch (e) {
      console.error(e);
    }
  }

  async function generateCertificates(eventId) {
    try {
      const uid = localStorage.getItem("uid");
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user");
      const token = await user.getIdToken();
      await fetch(`http://localhost:4000/api/events/${eventId}/certificates/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ uid })
      });
      alert("Certificates generated!");
      loadStats();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow p-4">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <ul className="space-y-3">
          <li><button onClick={loadStats}>Dashboard</button></li>
          <li><button onClick={() => { loadEvents(); navigate("/admin/manage-events"); }}>Manage Events</button></li>
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
          {(!events || events.length === 0) ? (
            <div className="text-gray-500 text-center py-8">No events created.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((evt) => (
                <EventCard
                  key={evt.id}
                  event={evt}
                  onView={loadRegistrations}
                  onCertificates={generateCertificates}
                />
              ))}
            </div>
          )}
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

