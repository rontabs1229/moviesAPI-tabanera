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

const movieSchema = new mongoose.Schema({
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