/* eslint-disable no-unused-vars */
// src/components/AdminManageEvents.js
import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function AdminManageEvents() {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    location_name: "",
    start_at: "",
    end_at: "",
    registration_deadline: "",
    max_capacity: "",
    is_cancelled: false,
  });

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) loadEvents(user);
    });

    return () => unsubscribe();
  }, []);

  async function loadEvents(user) {
    try {
      const token = await user.getIdToken();
      const uid = localStorage.getItem("uid");
      const res = await fetch("http://localhost:4000/api/admin/events-all", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ uid })
      });
      const data = await res.json();
      // only show active events
      setEvents(data.filter(evt => !evt.is_cancelled));
    } catch (err) {
      console.error(err);
      setEvents([]);
    }
  }

  function openForm() {
    setForm({
      title: "",
      description: "",
      category: "",
      location_name: "",
      start_at: "",
      end_at: "",
      registration_deadline: "",
      max_capacity: "",
      is_cancelled: false,
    });
    setShowForm(true);
  }

  async function saveEvent(e) {  // create event
    e.preventDefault();
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;
    const token = await user.getIdToken();
    const uid = localStorage.getItem("uid");

    // 1. Get or create location and get its id
    let location_id = null;
    try {
      const locRes = await fetch("http://localhost:4000/api/location/setLocation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name: form.location_name })
      });
      const locData = await locRes.json();
      location_id = locData.id || locData.location_id;
    } catch (err) {
      alert("Failed to set location");
      return;
    }

    // 2. Prepare event data with default image URL
    const eventData = {
      ...form,
      location_id,
      image_url: "https://placehold.co/600x400?text=Event+Image",
      uid
    };
    delete eventData.location_name;

    try {
      await fetch("http://localhost:4000/api/admin/create-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(eventData),
      });
      setShowForm(false);
      loadEvents(user);
    } catch (err) {
      console.error(err);
      alert("Failed to create event.");
    }
  }

  // SOFT DELETE / CANCEL EVENT
  async function cancelEvent(id) {
    console.log("Cancelling event:", id);
    if (!window.confirm("Are you sure you want to cancel this event?")) return;
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;
    const token = await user.getIdToken();
    const uid = localStorage.getItem("uid");

    try {
      const res = await fetch(`http://localhost:4000/api/admin/events/${id}/cancel`, { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ uid })
      });
      const data = await res.json();
      if (res.ok) {
        // remove the cancelled event immediately from the UI
        setEvents(prev => prev.filter(evt => evt.id !== id));
      } else {
        alert(data.error || "Failed to cancel event.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to cancel event.");
    }
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Events</h1>
        <button
          onClick={() => openForm()}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          + Create Event
        </button>
      </div>

      {/* Events List */}
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-lg font-bold mb-4">All Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((evt) => (
            <div key={evt.id} className="rounded-xl border border-blue-100 bg-white p-6 shadow hover:shadow-xl transition flex flex-col gap-2 min-w-[300px]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">🎫</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${evt.is_cancelled ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                  {evt.is_cancelled ? 'Cancelled' : 'Active'}
                </span>
              </div>
              <div className="font-bold text-lg text-gray-900">{evt.title}</div>
              <div className="text-gray-500 text-sm mb-2">{evt.description}</div>
              <div className="text-xs text-gray-400 mb-1">{new Date(evt.start_at).toLocaleString()} - {new Date(evt.end_at).toLocaleString()}</div>
              <div className="text-xs text-gray-400 mb-3">Capacity: {evt.max_capacity || 'Unlimited'}</div>
              <div className="flex gap-2 mt-auto">
                {!evt.is_cancelled && (
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded"
                    onClick={() => cancelEvent(evt.id)}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Create Event</h2>
            <form onSubmit={saveEvent} className="space-y-4">
              <input type="text" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border p-2 rounded" required />
              <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border p-2 rounded" />
              <input type="text" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border p-2 rounded" />
              <input type="text" placeholder="Location Name" value={form.location_name} onChange={(e) => setForm({ ...form, location_name: e.target.value })} className="w-full border p-2 rounded" required />
              <input type="datetime-local" placeholder="Registration Deadline" value={form.registration_deadline} onChange={(e) => setForm({ ...form, registration_deadline: e.target.value })} className="w-full border p-2 rounded" />
              <div className="flex space-x-2">
                <input type="datetime-local" value={form.start_at} onChange={(e) => setForm({ ...form, start_at: e.target.value })} className="w-1/2 border p-2 rounded" required />
                <input type="datetime-local" value={form.end_at} onChange={(e) => setForm({ ...form, end_at: e.target.value })} className="w-1/2 border p-2 rounded" required />
              </div>
              <input type="number" placeholder="Max Capacity" value={form.max_capacity} onChange={(e) => setForm({ ...form, max_capacity: e.target.value })} className="w-full border p-2 rounded" />
              <div className="flex justify-end space-x-3">
                <button type="button" className="px-4 py-2 bg-gray-400 text-white rounded" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
