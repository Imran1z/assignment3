const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost/taskmanager', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const TaskSchema = new mongoose.Schema({
  taskNumber: { type: String, unique: true, required: true },
  timeEstimate: { type: Number, required: true },
  estimateNotes: String,
  actualHours: Number,
  notes: String,
  completed: { type: Boolean, default: false },
  totalHours: Number,
  finalNotes: String,
});

const Task = mongoose.model('Task', TaskSchema);

app.post('/api/tasks', async (req, res) => {
    console.log(req.body)
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    console.log(error)
    res.status(400).json("Duplicate task");
  }
});

app.get('/api/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.send(tasks);
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post('/api/tasks/:id/complete', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { completed: true, totalHours: req.body.totalHours, finalNotes: req.body.finalNotes },
      { new: true }
    );
    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
