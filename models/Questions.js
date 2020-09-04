const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  qnum: {
    type: Number,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  attachment: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Question", questionSchema);
