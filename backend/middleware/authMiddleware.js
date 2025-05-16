import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const authMiddleware = (req, res, next) => {
    // Skip authentication for certain routes
    const publicRoutes = [
        '/',
        '/api/login',
        '/api/register', 
        '/privacy-policy',
    ];

    if (publicRoutes.includes(req.path)) {
        return next();
    }

    // Get token from header, cookie, or query parameter
    const token = req.header('Authorization')?.replace('Bearer ', '') || 
                 req.cookies?.token || 
                 req.query?.token;

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

export default authMiddleware;