// src/components/AdminManageEvents.js
import React, { useEffect, useState } from "react";
// import { apiFetch } from "../utils/fetchHelper";

export default function AdminManageEvents() {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    start_at: "",
    end_at: "",
    max_capacity: "",
  });

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    const res = await apiFetch("/events");
    setEvents(await res.json());
  }

  function openForm(event = null) {
    if (event) {
      setEditingEvent(event);
      setForm({
        title: event.title,
        description: event.description,
        category: event.category,
        start_at: event.start_at,
        end_at: event.end_at,
        max_capacity: event.max_capacity || "",
      });
    } else {
      setEditingEvent(null);
      setForm({
        title: "",
        description: "",
        category: "",
        start_at: "",
        end_at: "",
        max_capacity: "",
      });
    }
    setShowForm(true);
  }

  async function saveEvent(e) {
    e.preventDefault();
    if (editingEvent) {
      // Update existing event
      await apiFetch(`/events/${editingEvent.id}`, {
        method: "PATCH",
        body: JSON.stringify(form),
      });
    } else {
      // Create new event
      await apiFetch("/events", {
        method: "POST",
        body: JSON.stringify(form),
      });
    }
    setShowForm(false);
    loadEvents();
  }

  async function cancelEvent(id) {
    if (!window.confirm("Are you sure you want to cancel this event?")) return;
    await apiFetch(`/events/${id}`, { method: "DELETE" });
    loadEvents();
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
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2">Title</th>
              <th className="p-2">Date</th>
              <th className="p-2">Capacity</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((evt) => (
              <tr key={evt.id} className="border-b">
                <td className="p-2">{evt.title}</td>
                <td className="p-2">
                  {new Date(evt.start_at).toLocaleDateString()} -{" "}
                  {new Date(evt.end_at).toLocaleDateString()}
                </td>
                <td className="p-2">{evt.max_capacity || "Unlimited"}</td>
                <td className="p-2">
                  {evt.is_cancelled ? (
                    <span className="text-red-600">Cancelled</span>
                  ) : (
                    <span className="text-green-600">Active</span>
                  )}
                </td>
                <td className="p-2 space-x-2">
                  {!evt.is_cancelled && (
                    <>
                      <button
                        className="px-3 py-1 bg-yellow-500 text-white rounded"
                        onClick={() => openForm(evt)}
                      >
                        Edit
                      </button>
                      <button
                        className="px-3 py-1 bg-red-500 text-white rounded"
                        onClick={() => cancelEvent(evt.id)}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">
              {editingEvent ? "Edit Event" : "Create Event"}
            </h2>
            <form onSubmit={saveEvent} className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border p-2 rounded"
                required
              />
              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border p-2 rounded"
              />
              <div className="flex space-x-2">
                <input
                  type="datetime-local"
                  value={form.start_at}
                  onChange={(e) => setForm({ ...form, start_at: e.target.value })}
                  className="w-1/2 border p-2 rounded"
                  required
                />
                <input
                  type="datetime-local"
                  value={form.end_at}
                  onChange={(e) => setForm({ ...form, end_at: e.target.value })}
                  className="w-1/2 border p-2 rounded"
                  required
                />
              </div>
              <input
                type="number"
                placeholder="Max Capacity"
                value={form.max_capacity}
                onChange={(e) => setForm({ ...form, max_capacity: e.target.value })}
                className="w-full border p-2 rounded"
              />
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-400 text-white rounded"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  {editingEvent ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
