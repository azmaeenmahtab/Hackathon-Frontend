// EventCard.jsx
import React from "react";

const typeColors = {
  curriculum: "bg-blue-100 text-blue-600",
  scheduling: "bg-teal-100 text-teal-600",
  assessment: "bg-purple-100 text-purple-600",
};

const EventCard = ({ icon, type, title, description, date, onButtonClick, buttonLabel }) => (
  <div className="rounded-xl border border-blue-100 bg-white p-6 shadow hover:shadow-lg transition flex flex-col gap-2 min-w-[300px]">
    <div className="flex items-center justify-between mb-2">
      <span className="text-3xl">{icon}</span>
      <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${typeColors[type] || "bg-gray-100 text-gray-600"}`}>
        {type}
      </span>
    </div>
    <div className="font-bold text-lg text-gray-900">{title}</div>
    <div className="text-gray-500 text-sm mb-2">{description}</div>
    <div className="text-xs text-gray-400 mb-3">{date}</div>
    {onButtonClick && (
      <button
        onClick={onButtonClick}
        className="mt-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        {buttonLabel}
      </button>
    )}
  </div>
);

export default EventCard;