const { registerUser, loginUser } = require('../services/auth.service');
const { successResponse } = require('../utils/response');

const register = async (req, res, next) => {
  try {
    const { user, token } = await registerUser(req.body);
    return successResponse(res, 201, 'User registered successfully', { user, token });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { user, token } = await loginUser(req.body);
    return successResponse(res, 200, 'Login successful', { user, token });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };