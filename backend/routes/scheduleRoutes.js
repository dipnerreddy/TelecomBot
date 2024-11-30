const express = require("express");
const schedule = require("node-schedule");
const Schedule = require("../models/Schedule");
const twilioClient = require("../utils/twilioClient");
require("dotenv").config();

const router = express.Router();
const currentTimeIST = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });

// GET all schedules
router.get("/schedules", async (req, res) => {
  try {
    const schedules = await Schedule.find(); // Retrieve all schedules from the database
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE request to delete a schedule
router.delete("/schedule/:id", async (req, res) => {
  const { id } = req.params;
  
  try {
    // Find and delete the schedule
    const scheduleToDelete = await Schedule.findById(id);
    if (!scheduleToDelete) {
      return res.status(404).json({ message: "Schedule not found" });
    }
    // Cancel the job
    schedule.cancelJob(id);
    // Delete from the database
    await Schedule.findByIdAndDelete(id);
    
    res.status(200).json({ message: "Schedule deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Create a new schedule
router.post("/schedule", async (req, res) => {
  const { phoneNumber, frequency, message, endDate } = req.body;

  try {
    const newSchedule = new Schedule({ phoneNumber, frequency, message, endDate });
    await newSchedule.save();

    schedule.scheduleJob(newSchedule._id.toString(), `*/${frequency} * * * *`, async () => {
      const fromNumbers = JSON.parse(process.env.TWILIO_NUMBERS);
      const fromNumber = fromNumbers[Math.floor(Math.random() * fromNumbers.length)];

      try {
        await twilioClient.calls.create({
          to: phoneNumber,
          from: fromNumber,
          twiml: `<Response><Say>${message}</Say></Response>`,
        });
        console.log(`Call placed to ${phoneNumber} at ${currentTimeIST} `);
      } catch (err) {
        console.error(`Error placing call: ${phoneNumber} at ${currentTimeIST}`, err);
      }
    });

    res.status(201).json({ message: "Schedule created", id: newSchedule._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
