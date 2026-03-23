import mongoose from "mongoose";
import User from "../models/userModel.js";
import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const createToken = (userId) => {
    const secret = process.env.JWT_SECRET
    const expiresIn = process.env.TOKEN_EXPIRES_IN || '30d'

    if (!secret) throw new Error('JWT_SECRET is not defined on the server')
    return jwt.sign({ id: userId }, secret, { expiresIn })
}

// REGISTER FUNCTION
export async function register(req, res) {
    try {
        const name = String(req.body.name || "").trim();
        const emailRaw = String(req.body.email || "").trim();
        const email = validator.normalizeEmail(emailRaw) || emailRaw.toLowerCase();
        const password = String(req.body.password || "");

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'All field are required' })
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: 'Invalid Email' })
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, message: 'Password must be alteast 8 characters.' })
        }

        const exists = await User.findOne({ email }).lean();
        if (exists) {
            return res.status(409).json({ success: false, message: 'User already exists' })
        }

        const newId = new mongoose.Types.ObjectId();
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = new User({
            _id: newId,
            name,
            email,
            password: hashedPassword
        });
        await user.save();

        const token = createToken(newId.toString());

        return res.status(201).json({
            success: true,
            message: 'Account created successfully!',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
        })
    }
    catch (err) {
        console.error('Register error', err)
        if (err.code === 11000)
            return res.status(409).json({ success: false, message: 'User already exists' });

        return res.status(500).json({ success: false, message: 'Server Error' })
    }
}

// LOGIN FUNCTION
export async function login(req, res) {
    try {
        const emailRaw = String(req.body.email || "").trim();
        const email = validator.normalizeEmail(emailRaw) || emailRaw.toLowerCase();
        const password = String(req.body.password || "");

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'All field are required' })
        }

        // if (!validator.isEmail(email)) {
        //     return res.status(400).json({ success: false, message: 'Invalid email format' });
        // }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid email or passwrod' })

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        return res.status(200).json({
            success: true,
            message: 'Login Successful!',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
        });
    }
    catch (err) {
        console.error('Login error', err)
        return res.status(500).json({ success: false, message: 'Server Error' })
    }
}