const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movie");

const { userVerification, verifyAdmin } = require("../auth");

router.post("/addMovie", userVerification, verifyAdmin, movieController.addMovie);
router.get("/getMovie/:movieId", movieController.getMovie);
router.get("/getMovies", movieController.getAllMovies);

router.patch("/updateMovie/:movieId", userVerification, verifyAdmin, movieController.updateMovie);
router.delete("/deleteMovie/:movieId", userVerification, verifyAdmin, movieController.deleteMovie);
router.patch("/addComment/:movieId", userVerification, movieController.addComment);
router.get("/getComments/:movieId", userVerification, movieController.getComments);

module.exports = router;