const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mongoose connection
mongoose.connect("mongodb://localhost:27017/calendarapi");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Event schema
const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  participants: [
    {
      type: Array, // Assuming participants are represented by their names or IDs
    },
  ],
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String, // You can use Date type if you want to store time as well
    required: true,
  },
  duration: {
    type: Number, // Duration in minutes, for example
    required: true,
  },
  notes: {
    type: String,
  },
});

// Event model
const Event = mongoose.model("Event", eventSchema);

// Routes
app.post("/events", async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.get("/events", async (req, res) => {
  try {
    const events = await Event.find({});
    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(5000, () => {
  console.log(`Server running on port 5000`);
});
