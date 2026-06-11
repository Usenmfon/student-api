const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const userResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const normalizedEmail = email ? email.toLowerCase() : email;

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      res.status(400);
      throw new Error('Email already exists');
    }

    const user = await User.create({ name, email: normalizedEmail, password, role });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userResponse(user),
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email ? email.toLowerCase() : email;

    if (!email || !password) {
      res.status(400);
      throw new Error('Email and password are required');
    }

    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse(user),
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Profile fetched successfully',
    data: {
      user: userResponse(req.user),
    },
  });
};

module.exports = {
  register,
  login,
  getProfile,
};
