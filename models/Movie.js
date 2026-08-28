const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	comment: {
		type: String,
		required: [true, "Comment is required"]
	}
});

const ratingSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	rating: {
		type: Number,
		required: [true, "Rating is required"],
		min: 0,
		max: 5
	}
});


// Remove releaseDate
const movieSchema = new mongoose.Schema({
	image: {
		url: { type: String, default: "" },
		publicId: { type: String, default: "" }
	},
	ratings: {
		type: [ratingSchema],
		default: []
	},
	contentType: {
		type: String,
		enum: ["Movie", "Drama"],
		required: [true, "Enter content type"]
	},
	title: {
		type: String,
		required: [true, "Title is required"]
	},
	director: {
		type: String,
		required: [true, "Director is required"]
	},
	year: {
		type: Number,
		required: [true, "Enter Year"]
	},
	description: {
		type: String,
		required: [true, "Enter description"]
	},
	genre: {
		type: String,
		required: [true, "Enter genre"]
	},
	comments: {
		type: [commentSchema],
		default: []
	}
});

module.exports = mongoose.model("Movie", movieSchema);