import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import Modal from 'react-modal';
import Sidebar from './Sidebar'; // Import the Sidebar component
import './App.css';

Modal.setAppElement('#root');

function App() {
  const [value, setValue] = useState(new Date());
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventDate, setEventDate] = useState('');
  const [eventDetails, setEventDetails] = useState('');
  const [events, setEvents] = useState([]);
  const [importance, setImportance] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://localhost:7299/api/APIscontoller/GetAll');
      console.log(response.data);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleChange = (date) => {
    setValue(date);
    openSidebar(date);
  };

  const openSidebar = (date) => {
    const selectedDateEvents = data.filter(event => new Date(event.date).toDateString() === date.toDateString());
    setSelectedDateEvents(selectedDateEvents);
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    // let c=0;
    fetchData();
  }, []);

  const openModal = () => {
    setEventDate(value.toISOString().split('T')[0]);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const selectedDate = new Date(eventDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      alert('Cannot add events to a past date.');
    } else {
      try {
        const newEvent = { date: eventDate, details: eventDetails, importance: importance.join(', ') };
        console.log("new event", newEvent);
        const response = await axios.post(`https://localhost:7299/api/APIscontoller/Post?date=${newEvent.date}&events=${newEvent.details}&priority=${newEvent.importance}`);
        console.log("response " + response.data);
        
        setEvents([...events, newEvent]);
        closeModal();
        fetchData();
      } catch (err) {
        console.log(err.message);
      }
    }
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setImportance([...importance, value]);
    } else {
      setImportance(importance.filter((i) => i !== value));
    }
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const event = events.find(event => new Date(event.date).toDateString() === date.toDateString());
      if (event) {
        return 'tile-event';
      }
    }
    return null;
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'low':
        return 'low-priority';
      case 'medium':
        return 'medium-priority';
      case 'high':
        return 'high-priority';
      default:
        return '';
    }
  };

  return (
    <div className="App">
      <Calendar onChange={handleChange} value={value} tileClassName={tileClassName} />
      <div className="data-display">
        {data.length > 0 ? (
          <div>
            {/* <h2>Events on {value.toDateString()}</h2> */}
            {/* <div className="events-container">
              {data.map((ele, index) => (
                <div key={index} className={`event-card ${getPriorityClass(ele.importance)}`}>
                  <p>Date: {ele.date}</p>
                  <p>Details: {ele.events}</p>
                  <p>Priority: {ele.priority}</p>
                </div>
              ))}
            </div> */}
          </div>
        ) : (
          <p>No events found for this date.</p>
        )}
      </div>
      <button className="open-modal-button" onClick={openModal}>Add Event</button>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Add Event"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Add Event</h2>
        <form onSubmit={handleFormSubmit} className="event-form">
          <label>
            Event Date:
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              required
            />
          </label>
          <label>
            Event Details:
            <textarea
              value={eventDetails}
              onChange={(e) => setEventDetails(e.target.value)}
              required
            ></textarea>
          </label>
          <div className="importance-section">
          Priority:
            <label>
              
              <input
                type="checkbox"
                name="low"
                value="low"
                onChange={handleCheckboxChange}
              />
              Low
            </label>
            <label>
              <input
                type="checkbox"
                name="medium"
                value="medium"
                onChange={handleCheckboxChange}
              />
              Medium
            </label>
            <label>
              <input
                type="checkbox"
                name="high"
                value="high"
                onChange={handleCheckboxChange}
              />
              High
            </label>
          </div>
          <button type="submit" className="submit-button">Submit</button>
          <button type="button" className="close-button" onClick={closeModal}>Close</button>
        </form>
      </Modal>
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} events={selectedDateEvents} />
    </div>
  );
}

export default App;
