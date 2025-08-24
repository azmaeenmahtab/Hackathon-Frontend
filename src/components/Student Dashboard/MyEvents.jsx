import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EventCard from "../Event cards/EventCard";
import { getAuth } from "firebase/auth";

const StudentMyEvents = () => {
  const [myEvents, setMyEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch registered and attended events for the student from backend
    async function fetchMyEvents() {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();
      const uid = localStorage.getItem("uid");
      const res = await fetch("http://localhost:4000/api/student/my-events", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ uid })
      });
      const data = await res.json();
      setMyEvents(data);
    }
    fetchMyEvents();
  }, []);

  // Unregister from event handler (implement as needed)
  const handleUnregister = (eventId) => {
    // ...
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar (reuse or import as a component if needed) */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col gap-6">
        <h2 className="text-xl font-bold mb-4">Student Dashboard</h2>
        <nav className="flex flex-col gap-3">
          <a href="/student/my-events/dashboard" className="text-blue-600 font-semibold">My Events</a>
          <button onClick={() => navigate("/student/dashboard")}
            className="text-gray-700 text-left">All Events</button>
          <button className="text-red-500 mt-8 font-semibold text-left">Logout</button>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <h3 className="text-lg font-bold mb-4">My Registered Events</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myEvents.registeredEvents && myEvents.registeredEvents.length === 0 ? (
            <div className="text-gray-500 text-center py-8 w-full">You have not registered for any events.</div>
          ) : (
            myEvents.registeredEvents && myEvents.registeredEvents.map(event => (
              <EventCard
                key={event.id}
                icon={event.icon}
                type={event.type}
                title={event.title}
                description={event.description}
                date={event.date}
                onButtonClick={() => handleUnregister(event.id)}
                buttonLabel="Unregister"
              />
            ))
          )}
        </div>

        <h3 className="text-lg font-bold mb-8 mt-12">Attended Events</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myEvents.attendedEvents && myEvents.attendedEvents.length === 0 ? (
            <div className="text-gray-500 text-center py-8 w-full">You have not attended any events yet.</div>
          ) : (
            myEvents.attendedEvents && myEvents.attendedEvents.map(event => (
              <EventCard
                key={event.id}
                icon={event.icon}
                type={event.type}
                title={event.title}
                description={event.description}
                date={event.date}
                buttonLabel="Attended"
                // No unregister for attended events
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentMyEvents;
