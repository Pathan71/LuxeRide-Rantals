import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, token missing',
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        // const payload = jwt.sign(token, process.env.JWT_SECRET);
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(payload.id).select('-password');

        if (!user) {
            return res
                .status(401)
                .json({ success: false, message: 'User not found' });
        }

        req.user = user;
        next();
    } 
    catch (err) {
        console.error('JWT verification failed:', err);
        return res.status(401).json({
            success: false,
            message: 'Token missing, invalid or expired',
        });
    }
};

export default authMiddleware;
