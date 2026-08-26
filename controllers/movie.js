const Movie = require("../models/Movie");
const auth = require("../auth");
const { errorHandler } = require('../auth');


module.exports.addMovie = (req, res) => {
	if(!req.user.isAdmin) {
		return res.status(404).send("Only Admins are allowed")
	} else {
		const { title, director, year, description, genre } = req.body;
		let newMovie = new Movie({
			title: title,
			director: director,
			year: year,
			description: description,
			genre: genre
		});

		return newMovie.save()
		.then(movie => res.status(201).send(movie))
		.catch(error => errorHandler(error, req, res));
	}
}

module.exports.getMovie = (req, res) => {
	let {movieId} = req.params;

	return Movie.findById(movieId)
	.then(result => res.status(200).send(result))
	.catch(error => errorHandler(error, req, res));
}


module.exports.getAllMovies = (req, res) => {
	return Movie.find({})
	.then(movies => res.status(200).send({
		movies: movies
	}))
	.catch(error => errorHandler(error, req, res));
}

module.exports.updateMovie = (req, res) => {
	if(!req.user.isAdmin) {
		return res.status(404).send("Only admins are allowed")
	} else {
		const { title, director, year, description, genre } = req.body;
		const {movieId} = req.params;
		let updatedMovie = {
			title: title,
			director: director,
			year: year,
			description: description,
			genre: genre
		}

		return Movie.findByIdAndUpdate(movieId, updatedMovie)
		.then(movie => {
			if(movie) {
				res.status(200).send({
					message: "Movie updated successfully",
					updatedMovie: movie
				});
			} else {
				return res.status(404).send({
					message: "Movie not found"
				});
			}
		})
	}
}

module.exports.deleteMovie = (req, res) => {
	if(!req.user.isAdmin) {
		return res.status(404).send("Only admins are allowed")
	} else {
		const {movieId} = req.params;
		return Movie.findById(movieId)
		.then(movie => {
			if(!movie) {
				return res.status(404).send({
					message: "Movie not found"
				});
			}
			return movie.deleteOne()
			.then(() => {
				return res.status(200).send({
					message: "Movie deleted successfully"
				})
			})
			.catch(error => errorHandler(error, req, res))
		})
	}
}


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
			updatedMovie: updatedMovie
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