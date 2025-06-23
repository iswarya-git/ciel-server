// server.js
const express = require("express");
const cors = require("cors");
const connectDB = require('./db')
// require('dotenv').config();

const app = express();
const port = 8000;
const EmployeeModel = require('./modal/employee')
const TaskModel = require('./modal/task')

app.use(cors());
app.use(express.json());
connectDB()

// const jwt = require("jsonwebtoken");
// const JWT_SECRET_KEY  = process.env.JWT_SECRET;



app.post("/register", (req, res) => {

EmployeeModel.create(req.body).then(employees => res.json(employees))
.catch(err=> res.json(err))
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await EmployeeModel.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
    // For now, return user only — no JWT
    res.json({ success: true, user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});




app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

app.post("/test", (req, res) => {
  console.log("Received body:", req.body);
  res.json({ received: req.body });
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


// Get all tasks
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await TaskModel.find().sort({ dueDate: 1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a task
app.post("/api/tasks", async (req, res) => {
  try {
    const task = await TaskModel.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a task
app.put("/api/tasks/:id", async (req, res) => {
  try {
    const updatedTask = await TaskModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a task
app.delete("/api/tasks/:id", async (req, res) => {
  try {
    await TaskModel.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
