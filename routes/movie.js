import express from "express";
import {
  cancelMovie,
  removeMovie,
  searchMovie,
  newMovie,
  bookMovie,
} from "../controllers/movie.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/new", isAuthenticated, newMovie);
router.post("/remove", isAuthenticated, removeMovie);
router.post("/cancel", isAuthenticated, cancelMovie);
router.post("/book", isAuthenticated, bookMovie);
router.post("/search", isAuthenticated, searchMovie);



export default router;
