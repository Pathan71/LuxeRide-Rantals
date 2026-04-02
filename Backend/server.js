import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config();
import path from 'path';
import helmet from 'helmet'
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import userRouter from './routes/userRoutes.js';
import carRouter from './routes/carRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import paymentRouter from './routes/paymentRoutes.js'

const app = express();
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

connectDB();

const allowedOrigins = [
    "https://luxerider.netlify.app",
    "http://localhost:5173",
]

// MIDDLEWARES
app.use(cors({
    origin: function(origin, callback){
        if(!origin || allowedOrigins.includes(origin)){
            callback(null, true)
        }
        else {
            callback(new Error("Not allowed by CORS"))
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))

app.use(helmet({
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }))


app.use("/uploads", (req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin", "*");
  next();
}, express.static(path.join(process.cwd(), "uploads")));

// ROUTES
app.use('/api/auth', userRouter);
app.use('/api/cars', carRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/payment', paymentRouter)

app.get('/api/ping', (req, res) => res.json({
    ok: true,
    time: Date.now()
}))


// LISTEN
app.get('/', (req, res) => {
    res.send('API WORKING')
});

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log(`Server Started on http://localhost:${PORT}`)
})
