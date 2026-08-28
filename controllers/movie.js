const Movie = require("../models/Movie");
const auth = require("../auth");
const { errorHandler } = require('../auth');
const cloudinary = require("../config/cloudinary");
const uploadToCloudinary = require("../utils/uploadToCloudinary");



module.exports.addMovie = async (req, res) => {
	if (!req.user.isAdmin) {
		return res.status(404).send("Only Admins are allowed");
	}

	try {
		const { title, director, year, description, genre, contentType } = req.body;

		let newMovie = new Movie({
			title,
			director,
			year,
			description,
			genre,
			contentType
		});

		if (req.file) {
			const result = await uploadToCloudinary(req.file.buffer);
			newMovie.image = {
				url: result.secure_url,
				publicId: result.public_id
			};
		}

		const movie = await newMovie.save();
		return res.status(201).send(movie);
	} catch (error) {
		return errorHandler(error, req, res);
	}
};

module.exports.getMovie = (req, res) => {
	let { movieId } = req.params;
	return Movie.findById(movieId)
		.then(result => res.status(200).send(result))
		.catch(error => errorHandler(error, req, res));
};

module.exports.getAllMovies = (req, res) => {
	return Movie.find({})
		.then(movies => res.status(200).send({ movies }))
		.catch(error => errorHandler(error, req, res));
};

module.exports.updateMovie = async (req, res) => {
	if (!req.user.isAdmin) {
		return res.status(404).send("Only admins are allowed");
	}

	try {
		const { title, director, year, description, genre, contentType } = req.body;
		const { movieId } = req.params;

		const movie = await Movie.findById(movieId);
		if (!movie) {
			return res.status(404).send({ message: "Movie not found" });
		}

		let updatedFields = { title, director, year, description, genre, contentType };

		if (req.file) {
			// remove old image from Cloudinary if it exists
			if (movie.image?.publicId) {
				await cloudinary.uploader.destroy(movie.image.publicId);
			}
			const result = await uploadToCloudinary(req.file.buffer);
			updatedFields.image = {
				url: result.secure_url,
				publicId: result.public_id
			};
		}

		const updatedMovie = await Movie.findByIdAndUpdate(movieId, updatedFields, { new: true, runValidators: true });

		return res.status(200).send({
			message: "Movie updated successfully",
			updatedMovie
		});
	} catch (error) {
		return errorHandler(error, req, res);
	}
};

module.exports.deleteMovie = async (req, res) => {
	if (!req.user.isAdmin) {
		return res.status(404).send("Only admins are allowed");
	}

	try {
		const { movieId } = req.params;
		const movie = await Movie.findById(movieId);

		if (!movie) {
			return res.status(404).send({ message: "Movie not found" });
		}

		if (movie.image?.publicId) {
			await cloudinary.uploader.destroy(movie.image.publicId);
		}

		await movie.deleteOne();

		return res.status(200).send({ message: "Movie deleted successfully" });
	} catch (error) {
		return errorHandler(error, req, res);
	}
};



module.exports.addComment = (req, res) => {
	const { movieId } = req.params;
	const { comment } = req.body;
	const userId = req.user.id;

	Movie.findByIdAndUpdate(
		movieId,
		{ $push: { comments: { userId, comment } } },
		{ new: true, runValidators: true }
	)
	.then(updatedMovie => {
		if (!updatedMovie) {
			return res.status(404).send({ message: "No movie found" });
		}
		res.status(200).send({
			message: "comment added successfully",
			updatedMovie
		});
	})
	.catch(error => errorHandler(error, req, res));
};

module.exports.getComments = (req, res) => {
	const { movieId } = req.params;
	Movie.findById(movieId)
		.then(movie => {
			if (!movie) {
				return res.status(404).send({ message: "No movie found" });
			}
			res.status(200).send({ comments: movie.comments });
		})
		.catch(error => errorHandler(error, req, res));
};




module.exports.addRating = async (req, res) => {
	try {
		const { movieId } = req.params;
		const { rating } = req.body;
		const userId = req.user.id;

		const movie = await Movie.findById(movieId);
		if (!movie) {
			return res.status(404).send({ message: "No movie found" });
		}

		const existingRating = movie.ratings.find(r => r.userId.toString() === userId);
		if (existingRating) {
			return res.status(400).send({ message: "You have already rated this movie. Use update instead." });
		}

		movie.ratings.push({ userId, rating });
		await movie.save();

		return res.status(201).send({
			message: "Rating added successfully",
			updatedMovie: movie
		});
	} catch (error) {
		return errorHandler(error, req, res);
	}
};

module.exports.updateRating = async (req, res) => {
	try {
		const { movieId } = req.params;
		const { rating } = req.body;
		const userId = req.user.id;

		const movie = await Movie.findById(movieId);
		if (!movie) {
			return res.status(404).send({ message: "No movie found" });
		}

		const existingRating = movie.ratings.find(r => r.userId.toString() === userId);
		if (!existingRating) {
			return res.status(404).send({ message: "No existing rating found. Use add instead." });
		}

		existingRating.rating = rating;
		await movie.save();

		return res.status(200).send({
			message: "Rating updated successfully",
			updatedMovie: movie
		});
	} catch (error) {
		return errorHandler(error, req, res);
	}
};

module.exports.getRatings = (req, res) => {
	const { movieId } = req.params;
	Movie.findById(movieId)
		.then(movie => {
			if (!movie) {
				return res.status(404).send({ message: "No movie found" });
			}
			res.status(200).send({ ratings: movie.ratings });
		})
		.catch(error => errorHandler(error, req, res));
};