const express = require('express');
const router = express.Router();
const User = require('../models/user');
const flash = require('connect-flash');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');

const usersControllers = require('../controllers/users');

router.route('/register')
    .get(usersControllers.renderRegisterForm)
    .post(catchAsync(usersControllers.registerUser));

router.route('/login')
    .get( usersControllers.renderLoginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), usersControllers.loginUser);

router.get('/logout', usersControllers.logoutUser);

module.exports = router;