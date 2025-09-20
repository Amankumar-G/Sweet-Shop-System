import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export const loginUser = async (loginData) => {
  try {
    // Validate required fields
    if (!loginData.email) {
      throw new Error('Email and password are required');
    }
    if (!loginData.password) {
      throw new Error('Email and password are required');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginData.email)) {
      throw new Error('Please provide a valid email address');
    }

    // Find user by email
    const user = await User.findByEmail(loginData.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check password
    const isPasswordValid = await user.comparePassword(loginData.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // Convert user to object and remove password
    const userObject = user.toObject();
    delete userObject.password;

    // Return user data without password
    const userResponse = {
      id: userObject._id,
      username: userObject.username,
      email: userObject.email,
      role: userObject.role,
      createdAt: userObject.createdAt,
      updatedAt: userObject.updatedAt
    };

    return {
      token,
      user: userResponse
    };

  } catch (error) {
    // Re-throw validation and authentication errors
    if (error.message.includes('required') || 
        error.message.includes('valid email') ||
        error.message.includes('Invalid email or password')) {
      throw error;
    }

    // Handle unexpected errors
    throw new Error(`Login failed: ${error.message}`);
  }
};