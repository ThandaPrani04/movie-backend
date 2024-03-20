import mongoose from "mongoose";

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  show_date: {
    type: String,
    required: true,
  },
  start_time: {
    type: String,
    required: true,
  },
  end_time: {
    type: String,
    required: true,
  },
  total_seats: {
    type: Number,
  },
  remaining_seats: {
    type: Number,
  },
});

export const MovieAll = mongoose.model("MovieAll", schema);
