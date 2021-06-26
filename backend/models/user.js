const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const bcrypt = require('bcrypt');

const AutoIncrement = require('mongoose-sequence')(mongoose);

const userSchema = new Schema({
	userId: {
		type: Number
	},
	username: {
		type: String,
		required: true,
		primaryKey: true
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	info: {
		first: {
			type: String,
			required: true
		},
		middle: {
			type: String,
			default: null
		},
		last: {
			type: String,
			required: true
		},
		doctor: {
			type: Boolean,
			default: false
		},
		photo: {
			type: String,
			default: null
		},
		dob: {
			type: Date,
			required: true
		},
		blood: {
			type: String,
			required: true
		},
		address: {
			type: String,
			required: true
		},
		contact: {
			type: String,
			required: true
		},
		ethnicity: {
			type: String,
			default: null
		},
		guardian: {
			type: String,
			default: null
		},
		medicalRecords: {
			type: [String],
			default: []
		},
		allergies: {
			type: [String],
			default: []
		},
		disabilities: {
			type: [String],
			default: []
		},
		injuries: {
			type: [String],
			default: []
		},
		disorders: {
			type: [String],
			default: []
		},
		diseases: {
			type: [String],
			default: []
		},
	}
}, {
	timestamps: {
		createdAt: 'registered',
		updatedAt: 'modified'
	},
	// strict: false
});

userSchema.methods.generateHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(8));
userSchema.methods.validPassword = function (password) { return bcrypt.compareSync(password, this.password) };
userSchema.plugin(AutoIncrement, { inc_field: 'userId' });

const user = model('user', userSchema);

module.exports = user;