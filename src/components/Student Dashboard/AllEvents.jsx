/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EventCard from "../Event cards/EventCard";
import { getAuth } from "firebase/auth";

const StudentAllEvents = () => {
  const [allEvents, setAllEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all events from backend
    async function fetchEvents() {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();
      const res = await fetch("http://localhost:4000/api/global/events-all", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setAllEvents(data);
    }
    fetchEvents();
  }, []);

  // Register for event handler (implement as needed)
  const handleRegister = (eventId) => {
    // ...
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar (reuse or import as a component if needed) */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col gap-6">
        <h2 className="text-xl font-bold mb-4">Student Dashboard</h2>
        <nav className="flex flex-col gap-3">
          <button onClick={() => navigate("/student/my-events/dashboard")}
            className="text-gray-700 text-left">My Events</button>
          <button onClick={() => navigate("/student/dashboard")}
            className="text-blue-600 font-semibold text-left">All Events</button>
          <button className="text-red-500 mt-8 font-semibold text-left">Logout</button>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <h3 className="text-lg font-bold mb-4">All Events</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allEvents.length === 0 ? (
            <div className="text-gray-500 text-center py-8 w-full">No events available.</div>
          ) : (
            allEvents.map(event => (
              <EventCard
                key={event.id}
                icon={event.icon}
                type={event.type}
                title={event.title}
                description={event.description}
                date={event.date}
                onButtonClick={() => handleRegister(event.id)}
                buttonLabel="Register"
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentAllEvents;
