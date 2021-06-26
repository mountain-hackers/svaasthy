require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const CORS = require('cors');

const authRoute = require('./routes/auth');

const PORT = process.env.PORT ?? 5000;
const DB = process.env.DB ?? 'mongodb://localhost/carddb';

mongoose.connect(DB, {
	useNewUrlParser: true,
	useUnifiedTopology: true
}).then(() => console.log(`Connected to database.`));

const app = express();

app.use(express.json({
	limit: '50mb',
	extended: true
}));
app.use(express.urlencoded({
	extended: true,
	limit: '50mb'
}));
app.use(morgan('dev'));
app.use(CORS({
	methods: '*'
}));

app.use('/auth', authRoute);

app.listen(PORT, () => console.log(`Listening on port ${PORT}.`));