const jwt = require("jsonwebtoken");
require('dotenv').config();
module.exports.createAccessToken = (user) => {
	const data = {
		id: user._id,
		email: user.email,
		isAdmin: user.isAdmin
	};
	return jwt.sign(data, process.env.JWT_KEY, {});
}
module.exports.userVerification = (req, res, next) => {
	let token = req.headers.authorization;
	if(typeof token === 'undefined') {
		return res.status(401).send({ auth: "Failed", message: "No Token" });
	} else {
		token = token.slice(7);
		jwt.verify(token, process.env.JWT_KEY, (err, decodedToken) => {
			if(err) {
				return res.status(403).send({
					Auth: "Failed",
					message: err.message
				})
			} else {
				req.user = decodedToken;
				next();
			}
		})
	}
}
module.exports.verifyAdmin = (req, res, next) => {
	if(req.user.isAdmin){
		next();
	} else {
		return res.status(403).send({
			auth: "Failed",
			message: "Action Forbidden"
		})
	}
}
module.exports.errorHandler = (err, req, res, next) => {
	console.log("ERROR FOUND:");
	console.log(err);
	const errorMessage = err.message || 'Internal Server Error';
	res.status(500).json({
		error: {
			message: errorMessage,
			errorCode: err.code || 'SERVER_ERROR',
			details: err.details || null
		}
	});
};