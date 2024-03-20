import mongoose from "mongoose";

const schema = new mongoose.Schema({
  title: {
    type: String,
    ref:"MovieAll",
    required: true,
  },
  show_date: {
    ref:"MovieAll",
    type: String,
    required: true,
  },
  start_time: {
    ref:"MovieAll",
    type: String,
    required: true,
  },
  end_time: {
    ref:"MovieAll",
    type: String,
    required: true,
  },
  remaining_seats: {
    ref:"MovieAll",
    type: Number,
  },
  seats_sold: {
    type: Number,
  },
  user: {
    type: String,
    required: true,
  },
});

export const Movie = mongoose.model("Movie", schema);
