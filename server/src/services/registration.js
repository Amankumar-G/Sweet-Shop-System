import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerUser = async (userData) => {
  try {
    // Validate required fields
    if (!userData.username) {
      throw new Error('Username is required');
    }
    if (!userData.email) {
      throw new Error('Email is required');
    }
    if (!userData.password) {
      throw new Error('Password is required');
    }

    // Validate username length
    if (userData.username.length < 3) {
      throw new Error('Username must be at least 3 characters long');
    }
    if (userData.username.length > 30) {
      throw new Error('Username cannot exceed 30 characters');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      throw new Error('Please provide a valid email address');
    }

    // Validate password length
    if (userData.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    // Validate role if provided
    if (userData.role && !['customer', 'admin'].includes(userData.role)) {
      throw new Error('Invalid role');
    }

    // Check if email already exists
    const existingEmail = await User.findByEmail(userData.email);
    if (existingEmail) {
      throw new Error('User with this email already exists');
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username: userData.username });
    if (existingUsername) {
      throw new Error('Username is already taken');
    }

    // Create user
    const user = new User({
      username: userData.username,
      email: userData.email,
      password: userData.password,
      role: userData.role || 'customer'
    });

    // Save user to database
    const savedUser = await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data without password
    const userResponse = {
      id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      role: savedUser.role,
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt
    };

    return {
      token,
      user: userResponse
    };

  } catch (error) {
    // Handle MongoDB validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      if (error.keyPattern.email) {
        throw new Error('User with this email already exists');
      }
      if (error.keyPattern.username) {
        throw new Error('Username is already taken');
      }
    }

    // Re-throw other errors
    throw error;
  }
};