/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EventCard from "../Event cards/EventCard";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

const StudentMyEvents = () => {
  const [myEvents, setMyEvents] = useState({ registeredEvents: [], attendedEvents: [] });
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      const token = await user.getIdToken();
      const uid = localStorage.getItem("uid"); // or user.uid
      try {
        const res = await fetch("http://localhost:4000/api/student/my-events", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ uid }),
        });
        const data = await res.json();
        setMyEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    });

    return () => unsubscribe(); // cleanup listener
  }, []);

  const handleUnregister = async (eventId) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const token = await user.getIdToken();
    const uid = localStorage.getItem("uid");

    try {
      const res = await fetch(`http://localhost:4000/api/global/events-unregister/${eventId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ uid }),
      });

      if (res.ok) {
        // Remove the event from the registeredEvents list in state
        setMyEvents(prev => ({
          ...prev,
          registeredEvents: prev.registeredEvents.filter(e => e.id !== eventId)
        }));
        alert("You have successfully unregistered.");
      } else {
        alert("Failed to unregister. Try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error unregistering. Try again.");
    }
  };

  const handleLogout = async () => {
  try {
    const auth = getAuth();

    // 1. Sign out from Firebase
    await signOut(auth);

    // 2. Remove user data from localStorage
    localStorage.removeItem("uid");
    localStorage.removeItem("authToken"); // if you stored token

    // 3. Optional: clear app state (Redux/Context)
    // dispatch(logoutAction());

    // 4. Redirect to login page
    window.location.href = "/signin"; 
  } catch (error) {
    console.error("Logout error:", error);
  }
};

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col gap-6">
        <h2 className="text-xl font-bold mb-4">Student Dashboard</h2>
        <nav className="flex flex-col gap-3">
          <a href="/student/my-events/dashboard" className="text-blue-600 font-semibold">My Events</a>
          <button onClick={() => navigate("/student/dashboard")}
            className="text-gray-700 text-left">All Events</button>
          <button className="text-red-500 mt-8 font-semibold text-left" onClick={handleLogout}>Logout</button>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <h3 className="text-lg font-bold mb-4">My Registered Events</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myEvents.registeredEvents.length === 0 ? (
            <div className="text-gray-500 text-center py-8 w-full">You have not registered for any events.</div>
          ) : (
            myEvents.registeredEvents.map(event => {
              const status = event.is_cancelled ? "Cancelled" : "Registered";
              return (
                <EventCard
                  key={event.id}
                  icon={event.icon}
                  type={event.type}
                  title={event.title}
                  description={event.description}
                  date={event.date}
                  status={status}
                  onButtonClick={() => handleUnregister(event.id)}
                  buttonLabel="Unregister"
                />
              );
            })
          )}
        </div>

        <h3 className="text-lg font-bold mb-8 mt-12">Attended Events</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myEvents.attendedEvents.length === 0 ? (
            <div className="text-gray-500 text-center py-8 w-full">You have not attended any events yet.</div>
          ) : (
            myEvents.attendedEvents.map(event => {
              const status = event.is_cancelled ? "Cancelled" : "Attended";
              return (
                <EventCard
                  key={event.id}
                  icon={event.icon}
                  type={event.type}
                  title={event.title}
                  description={event.description}
                  date={event.date}
                  status={status}
                  buttonLabel="Attended"
                />
              );
            })
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentMyEvents;
