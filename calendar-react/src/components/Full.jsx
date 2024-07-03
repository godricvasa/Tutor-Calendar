import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import { format } from "date-fns";

const App = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventTitle, setEventTitle] = useState("");
  const [description, setDescription] = useState("");
  const [participants, setParticipants] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/events");
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  const handleDateClick = (arg) => {
    setSelectedDate(arg.dateStr);
    setDate(arg.dateStr);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedDate(null);
    setEventTitle("");
    setDescription("");
    setParticipants("");
    setDate("");
    setTime("");
    setDuration("");
    setNotes("");
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const durationInMinutes = parseFloat(duration) * 60; // Convert hours to minutes

    // Combine date and time into a single Date object
    const eventDateTime = new Date(`${date}T${time}`);

    const newEvent = {
      title: eventTitle,
      description,
      participants: participants.split(","), // Handle multiple participants
      date: eventDateTime,
      time,
      duration: durationInMinutes, // Duration in minutes
      notes,
    };
    console.log(newEvent);
    try {
      const response = await axios.post(
        "http://localhost:5000/events",
        newEvent
      );
      alert("Event created successfully:", response.data);
      setEvents([...events, response.data]); // Update events state with the new event
      closeModal();
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          start: "prev,next",
          center: "title",
          end: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        height="auto"
        contentHeight="auto"
        dateClick={handleDateClick}
        events={events.map((event) => ({
          title: event.title,
          start: new Date(event.date).toISOString(), // Ensure date format is correct
        }))}
      />
      {modalOpen && (
        <div className="fixed inset-0 z-10 flex justify-center items-center bg-gray-800 bg-opacity-50">
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">
              Add Event on {selectedDate}
            </h2>
            <form onSubmit={handleFormSubmit}>
              <label className="block mb-2">
                <span className="text-gray-700">Event Title:</span>
                <input
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="mt-1 block w-full rounded border-2 border-green-300 focus:border-green-500 focus:ring-opacity-50"
                  required
                />
              </label>
              <label className="block mb-2">
                <span className="text-gray-700">Description:</span>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full rounded border-2 border-green-300 focus:border-green-500 focus:ring-opacity-50"
                ></textarea>
              </label>
              <label className="block mb-2">
                <span className="text-gray-700">List of Participants:</span>
                <input
                  type="text"
                  value={participants}
                  onChange={(e) => setParticipants(e.target.value)}
                  className="mt-1 block w-full rounded border-2 border-green-300 focus:border-green-500 focus:ring-opacity-50"
                />
              </label>
              <label className="block mb-2">
                <span className="text-gray-700">Date:</span>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 block w-full rounded border-2 border-green-300 focus:border-green-500 focus:ring-opacity-50"
                  required
                />
              </label>
              <label className="block mb-2">
                <span className="text-gray-700">Time (eg: 13:30):</span>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="mt-1 block w-full rounded border-2 border-green-300 focus:border-green-500 focus:ring-opacity-50"
                  required
                />
              </label>
              <label className="block mb-2">
                <span className="text-gray-700">Duration in hours:</span>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="mt-1 block w-full rounded border-2 border-green-300 focus:border-green-500 focus:ring-opacity-50"
                  required
                />
              </label>
              <label className="block mb-2">
                <span className="text-gray-700">Notes:</span>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1 block w-full rounded border-2 border-green-300 focus:border-green-500 focus:ring-opacity-50"
                  required
                ></textarea>
              </label>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
              >
                Add Event
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="ml-8 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
              >
                Close
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
