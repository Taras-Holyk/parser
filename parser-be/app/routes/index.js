const express = require('express');
const app = express();
const appRouter = require('./app.router');
const userRouter = require('./user.router');

app.use('/', appRouter);
app.use('/users', userRouter);

module.exports = app;
