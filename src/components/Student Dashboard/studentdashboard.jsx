
import React, { useState, useEffect } from "react";
import EventCard from "../Event cards/EventCard";

// Dummy data for demonstration
const registeredEventsSample = [
	{ id: 1, title: "Tech Talk: AI in 2025", date: "2025-09-10", status: "Registered" },
	{ id: 2, title: "Hackathon Kickoff", date: "2025-09-15", status: "Registered" },
];
const allEventsSample = [
	{ id: 1, title: "Tech Talk: AI in 2025", date: "2025-09-10" },
	{ id: 2, title: "Hackathon Kickoff", date: "2025-09-15" },
	{ id: 3, title: "Robotics Workshop", date: "2025-09-20" },
];

const StudentDashboard = () => {
	const [registeredEvents, setRegisteredEvents] = useState(registeredEventsSample);
	const [allEvents, setAllEvents] = useState(allEventsSample);



    // Example event data
const events = [
  {
    id: 1,
    icon: "📅",
    type: "scheduling",
    title: "Academic Scheduling",
    description: "Deliver Student-Centric Schedules",
    date: "2025-09-10 10:00 AM",
  },
  {
    id: 1,
    icon: "📅",
    type: "scheduling",
    title: "Academic Scheduling",
    description: "Deliver Student-Centric Schedules",
    date: "2025-09-10 10:00 AM",
  },
  {
    id: 1,
    icon: "📅",
    type: "scheduling",
    title: "Academic Scheduling",
    description: "Deliver Student-Centric Schedules",
    date: "2025-09-10 10:00 AM",
  },
  {
    id: 1,
    icon: "📅",
    type: "scheduling",
    title: "Academic Scheduling",
    description: "Deliver Student-Centric Schedules",
    date: "2025-09-10 10:00 AM",
  },
  {
    id: 1,
    icon: "📅",
    type: "scheduling",
    title: "Academic Scheduling",
    description: "Deliver Student-Centric Schedules",
    date: "2025-09-10 10:00 AM",
  },
  // ...more events
];



	// Unregister from event handler
	const handleUnregister = (eventId) => {
		setRegisteredEvents(registeredEvents.filter(event => event.id !== eventId));
	};

	// Register for event handler
	const handleRegister = (eventId) => {
		const eventToRegister = allEvents.find(event => event.id === eventId);
		if (eventToRegister && !registeredEvents.some(e => e.id === eventId)) {
			setRegisteredEvents([...registeredEvents, { ...eventToRegister, status: "Registered" }]);
		}
	};

	return (
		<div className="flex min-h-screen bg-gray-100">
			{/* Sidebar */}
			<aside className="w-64 bg-white shadow-lg p-6 flex flex-col gap-6">
				<h2 className="text-xl font-bold mb-4">Student Dashboard</h2>
				<nav className="flex flex-col gap-3">
					<a href="#my-events" className="text-blue-600 font-semibold">My Events</a>
					<a href="#all-events" className="text-gray-700">All Events</a>
					<button className="text-red-500 mt-8 font-semibold text-left">Logout</button>
				</nav>
			</aside>

			{/* Main Content */}
			<main className="flex-1 p-8">
				{/* Registered Events */}
				<section id="my-events" className="mb-10">
					<h3 className="text-lg font-bold mb-4">My Registered Events</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {events.map(event => (
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
  ))}
</div>
	
				</section>

				{/* All Events */}
				<section id="all-events">
					<h3 className="text-lg font-bold mb-4">All Events</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {events.map(event => (
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
  ))}
</div>
	
				</section>
			</main>
		</div>

                    )
};

export default StudentDashboard;
