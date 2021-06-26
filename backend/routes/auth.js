const { Router } = require('express');
const { statusCode } = require('statushttp');

const { createToken, authenticate } = require('../helpers/auth');
const User = require('../models/user');

const auth = Router();

auth.route('/status')
.all(authenticate, async (req, res) => {
	res.status(statusCode.OK).json({
		user: {
			id: req.user.id,
			userId: req.user.userId,
			username: req.user.username,
			email: req.user.email,
			info: req.user.info
		},
		msg: `Logged in as ${req.user.username}.`
	});
});

auth.route('/modify')
.put(authenticate, async (req, res) => {
	const { user } = req;
	const { username, email, password } = req.body;

	if (username) {
		if (username.length < 5) {
			return res.status(statusCode.BAD_REQUEST).json({ msg: 'Too short username/password!' });
		}
 
		user.username = username;
	}

	if (email) {
		if (
			!/[^@\\/<>'"\s]+@[^@\\/<>'"\s]+.[^@\\/<>'"\s]{2,}/.test(email)
		) {
			return res.status(statusCode.BAD_REQUEST).json({ msg: 'Invalid e-mail address!' });
		}
		user.email = email;
	}

	if (password) {
		if (password.length < 8) {
			return res.status(statusCode.BAD_REQUEST).json({ msg: 'Too short username/password!' });
		}

		user.password = user.generateHash(password);
	}

	try {
		const props = [
			'first',
			'middle',
			'last',
			'doctor',
			'photo',
			'dob',
			'blood',
			'address',
			'contact',
			'ethnicity',
			'guardian',
			'medicalRecords',
			'allergies',
			'disabilities',
			'injuries',
			'disorders',
			'diseases'
		];

		for (const prop of props) {
			console.log('Hahahaha', prop)
			if (req.body[prop] != null) {
				user.info[prop] = req.body[prop];
			}
		}

		await user.save();
	} catch(e) {
		console.log(e);
		return res.status(statusCode.BAD_REQUEST).json({ msg: 'Invalid information!' });
	}
	
	return res.status(statusCode.OK).json({
		user: {
			username: user.username,
			email: user.email,
			info: user.info
		},
		token: createToken(user),
		msg: 'User updated!'
	});
})
.delete(authenticate, async (req, res) => {
	const { user } = req;
	const username = user.username;

	await user.delete();
	return res.status(statusCode.OK).json({ msg: `User '${username}' deleted!` });
});

auth.route('/login')
.post(async (req, res) => {
	const { user, password } = req.body;

	if (
		   user        == null
		|| password    == null
		|| user        == ''
		|| password    == ''
	) {
		return res.status(statusCode.BAD_REQUEST).json({ msg: 'Some fields are missing!' });
	}

	let info = {
		type: 'username',
		value: user,
		password
	}

	if (
		/[^@\\/<>'"]+@[^@\\/<>'"]+.[^@\\/<>'"]{2,}/.test(user)
	) {
		info.type = 'email';
	}

	const found = await User.findOne({ [info.type]: user });

	if (found == null) {
		return res.status(statusCode.UNAUTHORIZED).json({ msg: 'Invalid username/e-mail address!' });
	}

	if (!found.validPassword(password)) {
		return res.status(statusCode.UNAUTHORIZED).json({ msg: 'Wrong password!' });
	}

	return res.status(statusCode.OK).json({
		user: {
			username: found.username,
			token: createToken(found)
		},
		msg: 'Logged in!'
	});
});

auth.route('/signup')
.post(async (req, res) => {
	const {
		username,
		email,
		password
	} = req.body;

	if (
		   username    == null
		|| email       == null
		|| password    == null
		|| username    == ''
		|| email       == ''
		|| password    == ''
	) {
		return res.status(statusCode.BAD_REQUEST).json({ msg: 'Some fields are missing!' });
	}

	if (
		   username.length < 5
		|| password.length < 8
	) {
		return res.status(statusCode.BAD_REQUEST).json({ msg: 'Too short username/password!' });
	}

	if (
		!/[^@\\/<>'"\s]+@[^@\\/<>'"\s]+.[^@\\/<>'"\s]{2,}/.test(email)
	) {
		return res.status(statusCode.BAD_REQUEST).json({ msg: 'Invalid e-mail address!' });
	}

	const existing = await User.findOne({
		$or: [
			{
				username
			},
			{
				email
			},
		]
	});

	if (existing != null) {
		return res.status(statusCode.CONFLICT).json({ msg: 'Username or e-mail address already in use!' });
	}

	let user;
	
	try {
		user = new User({
			username, email
		});

		const props = [
			'first',
			'middle',
			'last',
			'doctor',
			'photo',
			'dob',
			'blood',
			'address',
			'contact',
			'ethnicity',
			'guardian',
			'medicalRecords',
			'allergies',
			'disabilities',
			'injuries',
			'disorders',
			'diseases'
		];

		user.info = {};

		for (const prop of props) {
			if (req.body[prop] != null) {
				user.info[prop] = req.body[prop];
			}
		}

		user.password = user.generateHash(password);
		await user.save();
	} catch(e) {
		console.log(e);
		return res.status(statusCode.BAD_REQUEST).json({ msg: 'Incomplete information!' });
	}

	return res.status(statusCode.OK).json({
		user: {
			username: user.username
		},
		msg: 'Successfully registered!'
	});
});

module.exports = auth;