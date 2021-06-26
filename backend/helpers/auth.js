const jwt = require('jsonwebtoken');
const { statusCode } = require('statushttp');

const User = require('../models/user');

const SECRET = process.env.SECRET ?? 'dev';

const createToken = user => {
	const payload = {
		username: user.username,
		email: user.email,
		id: user.id,
		registered: user.registered,
		modified: user.modified
	};

	return jwt.sign(payload, SECRET);
};

const verifyToken = token => {
	try {
		return jwt.verify(token, SECRET);
	} catch (e) {
		return null;
	}
};

const authenticate = async (req, res, next) => {
	const token = req.header('Authorization');

	if (token == null) {
		return res.status(statusCode.UNAUTHORIZED).json({ msg: 'Not logged in!' });
	}

	const user = verifyToken(token.split(' ')[1]);

	if (user) {
		const found = await User.findOne({
			username: user.username,
			email: user.email,
			_id: user.id,
			registered: user.registered,
			modified: user.modified
		});

		if (found == null) {
			return res.status(statusCode.UNAUTHORIZED).json({ msg: 'Not logged in!' });
		}

		req.user = found;
		return next();
	}
	
	return res.status(statusCode.UNAUTHORIZED).json({ msg: 'Not logged in!' });
};

module.exports = {
	createToken,
	verifyToken,
	authenticate
};