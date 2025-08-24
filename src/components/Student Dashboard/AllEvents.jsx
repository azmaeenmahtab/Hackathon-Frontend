/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EventCard from "../Event cards/EventCard";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import Modal from "../../components/Modal/Modal";

const StudentAllEvents = () => {
  const [allEvents, setAllEvents] = useState([]);
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      const token = await user.getIdToken();
      const res = await fetch("http://localhost:4000/api/global/events-all", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAllEvents(data);
    });

    return () => unsubscribe(); // cleanup
  }, []);

  // Register for event
  const handleRegister = async (eventId) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    try {
      console.log("event id:", eventId);

      const uid = localStorage.getItem("uid");
      const token = await user.getIdToken();
      const res = await fetch(
        `http://localhost:4000/api/global/events-register/${eventId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ uid }),
        }
      );

      if (res.ok) {
        setSelectedEvent(null); // close event details
        setShowSuccess(true); // show success popup
      } else {
        alert("Failed to register. Try again.");
      }
    } catch (error) {
      console.error("Error registering for event:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const auth = getAuth();

      // 1. Sign out from Firebase
      await signOut(auth);

      // 2. Remove user data from localStorage
      localStorage.removeItem("uid");

      // 3. Redirect to login page
      window.location.href = "/signin";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md flex flex-col justify-between sticky top-0 h-screen">
        <div className="p-6 flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-purple-700">UnIvents</h2>
          <button
            onClick={() => navigate("/student/my-events/dashboard")}
            className="px-4 py-2 bg-gray-600 text-white rounded"
          >
            My Events
          </button>
          <button
            onClick={() => navigate("/student/dashboard")}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            All Events
          </button>
          <button
             
            className="px-4 py-2 bg-gray-600 text-white rounded"
          >
            Profile
          </button>
        </div>
        <div className="p-6">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-600 text-white rounded"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <h3 className="text-lg font-bold mb-4">All Events</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allEvents.length === 0 ? (
            <div className="text-gray-500 text-center py-8 w-full">
              No events available.
            </div>
          ) : (
            allEvents.map((event) => {
              let status = "Upcoming"; // default

              if (event.is_cancelled) {
                status = "Cancelled";
              }

              return (
                <EventCard
                  key={event.id}
                  icon={event.icon}
                  type={event.type}
                  title={event.title}
                  description={event.description}
                  date={event.date}
                  status={status}
                  onButtonClick={() => setSelectedEvent(event)}
                  buttonLabel="Register"
                />
              );
            })
          )}
        </div>
      </main>

      {/* Event Details Modal */}
      {selectedEvent && (
        <Modal onClose={() => setSelectedEvent(null)}>
          <h2 className="text-xl font-bold mb-3">{selectedEvent.title}</h2>
          <p className="text-gray-600 mb-2">
            <strong>Type:</strong> {selectedEvent.type}
          </p>
          <p className="text-gray-600 mb-2">
            <strong>Date:</strong> {selectedEvent.date}
          </p>
          <p className="text-gray-700 mb-4">{selectedEvent.description}</p>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setSelectedEvent(null)}
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
            >
              Not Now
            </button>
            <button
              onClick={() => handleRegister(selectedEvent.id)}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Register
            </button>
          </div>
        </Modal>
      )}

      {/* Success Popup */}
      {showSuccess && (
        <Modal onClose={() => setShowSuccess(false)}>
          <div className="text-center">
            <h2 className="text-xl font-bold text-green-600 mb-4">
              Successfully Registered!
            </h2>
            <button
              onClick={() => setShowSuccess(false)}
              className="mt-4 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
            >
              OK
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default StudentAllEvents;
