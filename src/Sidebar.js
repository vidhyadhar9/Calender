import React, { useState } from 'react';
import axios from 'axios';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose, events, fetchData }) => {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [updatedDetails, setUpdatedDetails] = useState('');
  const [updatedPriority, setUpdatedPriority] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const lowPriorityEvents = events.filter(event => event.priority === 'low');
  const mediumPriorityEvents = events.filter(event => event.priority === 'medium');
  const highPriorityEvents = events.filter(event => event.priority === 'high');

  const handleDelete = async (event) => {
    try {
      console.log(event)
      let response=await axios.delete(`https://localhost:7299/api/APIscontoller/Remove?curDate=${event.date}&curEvents=${event.events}`);
      console.log("deletdd :",response);
      window.location.reload(false)
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const openUpdateModal = (event) => {
    setCurrentEvent(event);
    setUpdatedDetails(event.details);
    setUpdatedPriority(event.priority);
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setCurrentEvent(null);
    setUpdatedDetails('');
    setUpdatedPriority('');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (updatedDetails === currentEvent.details && updatedPriority === currentEvent.priority) {
      alert('No changes detected.');
      return;
    }
    try {
      console.log(currentEvent)
      await axios.put(`https://localhost:7299/api/APIscontoller/Update?id=${currentEvent.id}&newDetails=${updatedDetails}&newPriority=${updatedPriority}`, {
        details: updatedDetails,
        priority: updatedPriority,
      });
      window.location.reload(false)
     //fetchData(); // Refresh events after update
      closeUpdateModal();
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="close-sidebar-button" onClick={onClose}>Close</button>
      <h2>Events</h2>
     
      <div className="events-grid">
        <div className="priority-section">
          <h3>Low Priority</h3>
          {lowPriorityEvents.length > 0 ? (
            lowPriorityEvents.map((event, index) => (
              <div key={index} className="event-card low-priority">
                <p>Details: {event.events}</p>
                <button onClick={() => openUpdateModal(event)}>Update</button>
                <button onClick={() => handleDelete(event)}>Delete</button>
              </div>
            ))
          ) : (
            <p>No low priority events for this date.</p>
          )}
        </div>
        <div className="priority-section">
          <h3>Medium Priority</h3>
          {mediumPriorityEvents.length > 0 ? (
            mediumPriorityEvents.map((event, index) => (
              <div key={index} className="event-card medium-priority">
                <p>Details: {event.events}</p>
                <button onClick={() => openUpdateModal(event)}>Update</button>
                <button onClick={() => handleDelete(event)}>Delete</button>
              </div>
            ))
          ) : (
            <p>No medium priority events for this date.</p>
          )}
        </div>
        <div className="priority-section">
          <h3>High Priority</h3>
          {highPriorityEvents.length > 0 ? (
            highPriorityEvents.map((event, index) => (
              <div key={index} className="event-card high-priority">
                <p>Details: {event.events}</p>
                <button onClick={() => openUpdateModal(event)}>Update</button>
                <button onClick={() => handleDelete(event)}>Delete</button>
              </div>
            ))
          ) : (
            <p>No high priority events for this date.</p>
          )}
        </div>
      </div>

      {isUpdateModalOpen && (
        <div className="update-modal">
          <h3>Update Event</h3>
          <form onSubmit={handleUpdate}>
            <label>
              Event Details:
              <textarea
                value={updatedDetails}
                onChange={(e) => setUpdatedDetails(e.target.value)}
                required
              ></textarea>
            </label>
            <label>
              Priority:
              <select
                value={updatedPriority}
                onChange={(e) => setUpdatedPriority(e.target.value)}
                required
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
            <button type="submit">Update</button>
            <button type="button" onClick={closeUpdateModal}>Cancel</button>
          </form>
        </div>
      )}

      {showSuccessMessage && (
        <div className="success-message">
          Event updated successfully!
        </div>
      )}
    </div>
  );
};

export default Sidebar;
