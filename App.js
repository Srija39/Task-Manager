import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title: '', date: '', location: '' });
  const [searchParams, setSearchParams] = useState({ title: '', date: '', location: '' });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = (query = '') => {
    axios.get(`http://localhost:5000/events${query}`)
      .then(response => setEvents(response.data))
      .catch(error => console.log(error));
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/events', form)
      .then(() => {
        setForm({ title: '', date: '', location: '' });
        fetchEvents();
      })
      .catch(error => console.log(error));
  };

  const handleSearchChange = (e) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = Object.keys(searchParams)
      .map(key => searchParams[key] ? `${key}=${searchParams[key]}` : '')
      .filter(param => param)
      .join('&');
    fetchEvents(`?${query}`);
  };

  const deleteEvent = (id) => {
    axios.delete(`http://localhost:5000/events/${id}`)
      .then(() => fetchEvents())
      .catch(error => console.log(error));
  };

  return (
    <div className="container">
      <h1 className="header"><i>Event Booking System-Make Your Life Easy!!</i></h1>
      <form className="form" onSubmit={handleFormSubmit}>
        <input type="text" name="title" placeholder="Title" value={form.title} onChange={handleInputChange} required />
        <input type="date" name="date" value={form.date} onChange={handleInputChange} required />
        <input type="text" name="location" placeholder="Location" value={form.location} onChange={handleInputChange} required />
        <button type="submit" className="btn btn-primary">Add Event</button>
      </form>
      <form className="form search-form" onSubmit={handleSearch}>
        <input type="text" name="title" placeholder="Search by Title" value={searchParams.title} onChange={handleSearchChange} />
        <input type="date" name="date" value={searchParams.date} onChange={handleSearchChange} />
        <input type="text" name="location" placeholder="Search by Location" value={searchParams.location} onChange={handleSearchChange} />
        <button type="submit" className="btn btn-primary">Search</button>
      </form>
      <ul className="event-list">
        {events.map(event => (
          <li key={event._id}>
            <div>
              <div className="event-title">{event.title}</div>
              <div>{new Date(event.date).toLocaleDateString()}</div>
              <div>{event.location}</div>
            </div>
            <button onClick={() => deleteEvent(event._id)} className="btn btn-danger">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;