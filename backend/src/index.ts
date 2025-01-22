import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectToDatabase from './config/db';
import { APP_ORIGIN, NODE_ENV, PORT } from './constants/env';
import errorHandler from './middleware/errorHandler';
import  authenticate from './middleware/authenticate';
import { OK } from './constants/http';
import authRoutes from './routes/auth.route';
import userRoutes from './routes/user.route';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));    
app.use(
    cors({
        origin: APP_ORIGIN,
        credentials: true,
    })
);
app.use(cookieParser());

app.get('/', (_, res) => {
    return res.status(OK).json({
        message: 'Healthy',
    });
});

// auth routes
app.use('/auth', authRoutes);

//protected routes
app.use('/user', authenticate, userRoutes);

app.use(errorHandler);

app.listen (
    PORT, async () => {
        console.log(`Server is running on PORT ${PORT} in the ${NODE_ENV} environment`);
        await connectToDatabase()
    })

