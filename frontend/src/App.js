import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [formData, setFormData] = useState({
    phoneNumber: "",
    frequency: "",
    message: "",
    endDate: "",
  });

  const [schedules, setSchedules] = useState([]); // To store fetched schedules

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:50000/api/schedule", formData);
      alert("Schedule created successfully!");
      fetchSchedules(); // Fetch schedules after creating a new one
    } catch (error) {
      alert("Error creating schedule");
    }
  };

  // Fetch schedules from backend
  const fetchSchedules = async () => {
    try {
      const response = await axios.get("http://localhost:50000/api/schedules");
      setSchedules(response.data); // Set the fetched schedules to state
    } catch (error) {
      console.error("Error fetching schedules", error);
    }
  };

  // Delete schedule
  const deleteSchedule = async (id) => {
    try {
      await axios.delete(`http://localhost:50000/api/schedule/${id}`);
      alert("Schedule deleted successfully!");
      fetchSchedules(); // Fetch updated schedules after deletion
    } catch (error) {
      alert("Error deleting schedule");
    }
  };

  // Fetch schedules when the component mounts
  useEffect(() => {
    fetchSchedules();
  }, []);

  return (
    <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-dark text-white">
      {/* Form Section */}
      <div className="w-100 p-4" style={{ maxWidth: "500px" }}>
        <div className="card shadow-sm rounded-lg">
          <div className="card-body bg-light text-dark">
            <h1 className="card-title text-center mb-4">Call Scheduler</h1>

            <form onSubmit={handleSubmit}>
              {/* Phone Number Input */}
              <div className="mb-3">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  placeholder="Enter phone number"
                  className="form-control"
                  onChange={handleChange}
                />
              </div>

              {/* Frequency Input */}
              <div className="mb-3">
                <label className="form-label">Frequency (minutes)</label>
                <input
                  type="number"
                  name="frequency"
                  placeholder="Enter frequency"
                  className="form-control"
                  onChange={handleChange}
                />
              </div>

              {/* Message Input */}
              <div className="mb-3">
                <label className="form-label">Message</label>
                <input
                  type="text"
                  name="message"
                  placeholder="Enter your message"
                  className="form-control"
                  onChange={handleChange}
                />
              </div>

              {/* End Date Input */}
              <div className="mb-3">
                <label className="form-label">End Date & Time</label>
                <input
                  type="datetime-local"
                  name="endDate"
                  className="form-control"
                  onChange={handleChange}
                />
              </div>

              {/* Submit Button */}
              <div className="d-grid">
                <button type="submit" className="btn btn-primary btn-lg">
                  Schedule Call
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Display List of Schedules */}
      <div className="w-100 p-4" style={{ maxWidth: "500px" }}>
        <div className="card shadow-sm rounded-lg">
          <div className="card-body bg-light text-dark">
            <h2 className="card-title text-center mb-4">Scheduled Calls</h2>
            {schedules.length > 0 ? (
              <ul className="list-group">
                {schedules.map((schedule, index) => (
                  <li key={index} className="list-group-item">
                    <strong>Phone:</strong> {schedule.phoneNumber} <br />
                    <strong>Frequency:</strong> {schedule.frequency} min <br />
                    <strong>Message:</strong> {schedule.message} <br />
                    <strong>End Date:</strong> {schedule.endDate} <br />
                    {/* Delete Button */}
                    <button
                      className="btn btn-danger btn-sm mt-2"
                      onClick={() => deleteSchedule(schedule._id)}
                    >
                      Delete Schedule
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No schedules available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
