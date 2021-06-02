const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const { User } = require("../models");

// @desc      Register user
// @route     POST /api/v1/auth/register
// @access    Public
exports.register = asyncHandler(async (req, res, next) => {
	let { email, username, password, confirmPassword } = req.body;
	let errors = {};

	if (username.trim() === "")
		errors.username = "El nombre de usuario no puede estar vacío.";

	if (email.trim() === "") errors.email = "El email no puede estar vacío.";

	if (password.trim() === "")
		errors.password = "La contraseña no puede estar vacía.";

	if (password !== confirmPassword)
		errors.confirmPassword = "Las contraseñas no coinciden.";

	if (Object.keys(errors).length > 0) {
		return next(new ErrorResponse("Datos incorrectos.", 400, errors));
	}
	password = await bcrypt.hash(password, 6);

	const user = await User.create({
		username,
		email,
		password,
	});

	const userObject = {
		id: user.id,
		username: user.username,
		email: user.email,
		imageUrl: user.imageUrl,
	};

	sendTokenResponse(userObject, 200, res);
});

// @desc      Login user
// @route     POST /api/v1/auth/login
// @access    Public
exports.login = asyncHandler(async (req, res, next) => {
	const { username, password } = req.body;
	const errors = {};

	if (username.trim() === "")
		errors.username = "El nombre de usuario no puede estar vacío.";

	if (password.trim() === "")
		errors.password = "La contraseña no puede estar vacía.";

	if (Object.keys(errors).length > 0) {
		return next(new ErrorResponse("Datos incorrectos.", 400, errors));
	}

	const user = await User.findOne({
		where: { username },
	});

	if (!user) {
		return next(
			new ErrorResponse(
				"Nombre de usuario y/o contraseña incorrecta.",
				401
			)
		);
	}

	const correctPassword = await bcrypt.compare(password, user.password);

	if (!correctPassword) {
		return next(
			new ErrorResponse(
				"Nombre de usuario y/o contraseña incorrecta.",
				401
			)
		);
	}

	const userObject = {
		id: user.id,
		username: user.username,
		email: user.email,
		imageUrl: user.imageUrl,
	};

	sendTokenResponse(userObject, 200, res);
});

// @desc      Login user with Google
// @route     POST /api/v1/auth/login-with-google
// @access    Public
exports.loginWithGoogle = asyncHandler(async (req, res, next) => {
	const { displayName, email, photoURL } = req.body;
	const errors = {};
	let user;

	if (displayName.trim() === "")
		errors.displayName = "El nombre de usuario no puede estar vacío.";

	if (email.trim() === "") errors.email = "El correo no puede estar vacío.";

	if (Object.keys(errors).length > 0) {
		return next(new ErrorResponse("Datos incorrectos.", 400, errors));
	}

	user = await User.findOne({
		where: { email },
	});

	if (!user) {
		user = await User.create({
			username: displayName,
			email,
		});
	}

	const userObject = {
		id: user.id,
		username: user.username,
		email: user.email,
		imageUrl: photoURL,
	};

	sendTokenResponse(userObject, 200, res);
});

// @desc      Get current logged in user
// @route     POST /api/v1/auth/me
// @access    Private
exports.me = asyncHandler(async (req, res, next) => {
	const user = res.locals.user;

	res.status(200).json({
		success: true,
		data: user,
	});
});

// @desc      Log User out / clear Cookie
// @route     GET /api/v1/auth/logout
// @access    Private
exports.logout = asyncHandler(async (req, res, next) => {
	res.cookie("token", "none", {
		expires: new Date(Date.now() + 10 * 1000),
		httpOnly: true,
	});

	res.status(200).json({
		success: true,
		data: {},
	});
});

// Get token from model, create cookie and send response

const sendTokenResponse = (user, statusCode, res) => {
	// Create token
	const token = jwt.sign(user, process.env.JWT_SECRET);

	const options = {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
	};

	if (process.env.NODE_ENV === "production") {
		options.secure = true;
	}

	res.status(statusCode)
		.cookie("token", token, options)
		.json({ success: true, data: { user, token } });
};