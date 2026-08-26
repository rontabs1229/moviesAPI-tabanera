const User = require('../models/User');
const bcrypt = require('bcryptjs');
const auth = require("../auth");
const { errorHandler } = require('../auth');

module.exports.registerUser = (req, res) => {
	if(!req.body.email.includes("@")) {
		return res.status(400).send({
			message: 'Invalid email format'
		});
	}
	else if(req.body.password.length < 8) {
		return res.status(400).send({
			message: 'Password must be at least 8 characters long'
		});
	} else {

		let newUser = new User ({
			email: req.body.email,
			password: bcrypt.hashSync(req.body.password)
		});


		return newUser.save()
		.then((result) => res.status(201).send({
			message: "Registered Successfully"
		}))
		.catch(error => errorHandler(error, req, res));
	}
};

module.exports.loginUser = (req, res) => {
	if(!req.body.email || !req.body.email.includes('@')) {
		return res.status(400).send({ message: 'Invalid email format' });
	}

	return User.findOne({email: req.body.email})
	.then(user => {
		if(user == null) {
			return res.status(404).send({
				message: 'No email found'
			});
		}

		const passwordChecker = bcrypt.compareSync(req.body.password, user.password);

		if(!passwordChecker) {
			return res.status(401).send({ message: 'Incorrect email or password' });
		}

		return res.status(200).send({
			access: auth.createAccessToken(user)
		});
	})
	.catch(error => errorHandler(error, req, res));
}


module.exports.getUserProfile = (req, res) => {

    User.findById(req.user.id)
    .select('-password') 
    .then(user => {

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        return res.status(200).send({
        	user: user
        });
    })
    .catch(err => errorHandler(err, req, res));
};