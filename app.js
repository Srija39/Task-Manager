const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

mongoose.connect('mongodb://localhost/eventbooking', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(cors());
app.use(express.json());

const eventSchema = new mongoose.Schema({
  title: String,
  date: Date,
  location: String
});

const Event = mongoose.model('Event', eventSchema);

app.get('/events', async (req, res) => {
  const { title, date, location } = req.query;
  const query = {};
  if (title) query.title = new RegExp(title, 'i');
  if (date) query.date = new Date(date);
  if (location) query.location = new RegExp(location, 'i');
  const events = await Event.find(query);
  res.json(events);
});

app.post('/events', async (req, res) => {
  const event = new Event(req.body);
  await event.save();
  res.json(event);
});

app.delete('/events/:id', async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json({ message: 'Event deleted' });
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
