const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movie");
const { userVerification, verifyAdmin } = require("../auth");
const upload = require("../middleware/upload");

router.post("/addMovie", userVerification, verifyAdmin, upload.single("image"), movieController.addMovie);
router.get("/getMovie/:movieId", movieController.getMovie);
router.get("/getMovies", movieController.getAllMovies);
router.patch("/updateMovie/:movieId", userVerification, verifyAdmin, upload.single("image"), movieController.updateMovie);
router.delete("/deleteMovie/:movieId", userVerification, verifyAdmin, movieController.deleteMovie);

router.patch("/addComment/:movieId", userVerification, movieController.addComment);
router.get("/getComments/:movieId", userVerification, movieController.getComments);
router.patch("/updateComment/:movieId/:commentId", userVerification, movieController.updateComment);
router.patch("/deleteComment/:movieId/:commentId", userVerification, movieController.deleteComment);

router.post("/addRating/:movieId", userVerification, movieController.addRating);
router.patch("/updateRating/:movieId", userVerification, movieController.updateRating);
router.get("/getRatings/:movieId", movieController.getRatings);

module.exports = router;