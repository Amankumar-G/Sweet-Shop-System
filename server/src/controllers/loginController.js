import { loginUser } from '../services/login.js';

export const loginController = async (req, res) => {
  try {
    const result = await loginUser(req.body);
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result
    });
    
  } catch (error) {
    // Determine appropriate status code
    let statusCode = 500;
    let errorMessage = error.message;
    
    if (error.message.includes('Invalid email or password')) {
      statusCode = 401;
      errorMessage = 'Invalid email or password';
    } else if (error.message.includes('required') || 
               error.message.includes('valid email')) {
      statusCode = 400;
    }
    
    res.status(statusCode).json({
      success: false,
      message: errorMessage,
      data: null
    });
  }
};