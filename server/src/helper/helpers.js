import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export const generateAdminToken = () => {
  const adminPayload = {
    id: '68ce61473972f18633b9d689',
    username: 'admin',
    email : 'admin@gmail.com',  
    role: 'admin',
  };
  const token = jwt.sign(adminPayload, JWT_SECRET, { expiresIn: '1h' });
  return token;
};

export const generateUserToken = () => {
    const userPayload = {
    id: '68ce61473972f18633b9d680',
    username: 'user',
    email : 'user@gmail.com',  
    role: 'user', 
    };
    return jwt.sign(userPayload, JWT_SECRET, { expiresIn: '1h' });
};