import ErrorHandler from "../middlewares/error.js";
import { MovieAll } from "../models/movieall.js";
import { Movie } from "../models/movie.js";
import jwt from "jsonwebtoken";

export const newMovie = async (req, res, next) => {
  try {
    const {title, show_date, start_time, end_time, total_seats} = req.body;
    if (process.env.admin_object_id==jwt.verify(req.cookies.token,process.env.JWT_SECRET)._id){
      await MovieAll.create({
        title: title,
        show_date: show_date,
        start_time: start_time,
        end_time: end_time,
        total_seats: total_seats,
        remaining_seats: total_seats,
      });
  
      res.status(201).json({
        success: true,
        message: "Movie added Successfully",
      });
    }else{
      res.status(400).json({
        success: false,
        message: "Admin Rights Required",
      });
    }
    
  } catch (error) {
    next(error);
  }
};

export const bookMovie = async (req, res, next) => {
  try {
    const {title, show_date, start_time, end_time, seats_sold} = req.body;
    if (process.env.admin_object_id!=jwt.verify(req.cookies.token,process.env.JWT_SECRET)._id && (seats_sold>=1 && seats_sold<=4)){
      await Movie.create({
        title: title,
        show_date: show_date,
        start_time: start_time,
        end_time: end_time,
        seats_sold: seats_sold,
        user: req.user._id
      });
      await MovieAll.findOneAndUpdate(
        {
          title: title,
          show_date: show_date,
          start_time: start_time,
          end_time: end_time,
          remaining_seats: { $gte: seats_sold } 
        },
        {
          $inc: { remaining_seats: -seats_sold }
        }
      );
      res.status(201).json({
        success: true,
        message: "Movie booked Successfully",
      });
    }else{
      res.status(400).json({
        success: false,
        message: "Error",
      });
    }
    
  } catch (error) {
    next(error);
  }
};

export const searchMovie = async (req, res, next) => {
  try {
    const { title, show_date, start_time, end_time, total_seats, remaining_seats } = req.body;

    let query = {};
    if (title) {
      query.title = title;
    }
    if (show_date) {
      query.show_date = show_date;
    }
    if (start_time) {
      query.start_time = start_time;
    }
    if (end_time) {
      query.end_time = end_time;
    }
    if (total_seats) {
      query.total_seats = total_seats;
    }
    if (remaining_seats) {
      query.remaining_seats = remaining_seats;
    }

    const movie = await MovieAll.find(query);
    if (movie!=""){
      res.status(200).json({
        success: true,
        data: movie
      });
    }else{
      res.status(200).json({
        success: false,
        data: movie
      });
    }
  } catch (error) {
    next(error);
  }
};


export const removeMovie = async (req, res, next) => {
  try {
    const {title, show_date, start_time, end_time} = req.body;
    if (process.env.admin_object_id==jwt.verify(req.cookies.token,process.env.JWT_SECRET)._id){
      const movie = await MovieAll.findOne(req.body);
      if (!movie) return next(new ErrorHandler("Movie not found", 404));
      if (movie.total_seats!=movie.remaining_seats) return next(new ErrorHandler("Cannot be deleted", 404));
      await movie.deleteOne();
      res.status(200).json({
        message: "Movie Deleted!",
        success: true,
      });
    }else{
      res.status(400).json({
        message: "Admin Rights Required",
        success: false,
      });
    }
  } catch (error) {
    next(error);
  }
};


export const cancelMovie = async (req, res, next) => {
  try {
    let query ={};
    const {title, show_date, start_time, end_time, seats_sold} = req.body;
    if (process.env.admin_object_id!=jwt.verify(req.cookies.token,process.env.JWT_SECRET)._id){
      query={title:title, 
        show_date:show_date, 
        start_time: 
        start_time, 
        end_time:end_time, 
        seats_sold:seats_sold,
        user:req.user._id}
      const movie = await Movie.findOne(query);
      if (!movie) return next(new ErrorHandler("Booking not found", 404));
      await movie.deleteOne();
      await MovieAll.findOneAndUpdate(
        {
          title: title,
          show_date: show_date,
          start_time: start_time,
          end_time: end_time,
        },
        {
          $inc: { remaining_seats: +seats_sold }
        }
      );
      res.status(200).json({
        message: "Booking Cancelled!",
        success: true,
      });
    }else{
      res.status(400).json({
        message: "Admin Rights Breached",
        success: false,
      });
    }
  } catch (error) {
    next(error);
  }
};




