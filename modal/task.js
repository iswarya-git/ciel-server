const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    taskName: { type: String, required: true },
    description: String,
    dueDate: { type: Date, required: true },
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Task", TaskSchema);
