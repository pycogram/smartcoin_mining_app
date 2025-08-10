import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../../.env') });

import { configureCloudinary } from './config/cloudinary.js';
configureCloudinary();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { postRoutes } from './routes/post.js';
import { minerRoutes } from './routes/miner.js';
import { lockRoutes } from './routes/lock.js';
import { ReferralRoutes } from './routes/referral.js';
import { walletRoutes } from './routes/wallet.js';
import { historyRoutes } from './routes/history.js';
import { userRoutes } from './routes/user.js';
import { commentRoutes } from './routes/comment.js';
import { likeRoutes } from './routes/like.js';

//instanciate an express obj to server with it
const app = express(); 

// middleware to parse cookies
app.use(cookieParser());

// security middleware to set various HTTP headers with CSP for images
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: [
        "'self'",
        "data:",  
        "blob:",                  
        "https://res.cloudinary.com",
      ],
    },
  })
);


// cors that allows access to the server from a specified domain
if(process.env.NODE_ENV !== 'production') {
    app.use(
        cors({
            origin: 'http://localhost:5173', // allow requests from this origin
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // allowed methods
            credentials: true, // allow credentials
        })
    )
}

// middleware that allow json
app.use(express.json());

// middleware that allow url encoded data
app.use(express.urlencoded({ extended: true }));

// endpoint and route handlers
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/dashboard', minerRoutes);
app.use('/api/package', lockRoutes);
app.use('/api/referral', ReferralRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/comment', commentRoutes);
app.use('/api/like', likeRoutes);

if(process.env.NODE_ENV === 'production'){
    const clientBuildPath = path.join(__dirname, '../../sc_client/dist');
    app.use(express.static(clientBuildPath));

    app.get('*', (req, res) => {
        res.sendFile(path.join(clientBuildPath, 'index.html'));
    })
}

const {DB_URL, PORT} = process.env;

if (!DB_URL || !PORT) {
  throw new Error("Missing DB_URL in environment variables");
}
// connect to db
mongoose.connect(DB_URL).then(() => {
    console.log(`connected to DB successfully`);
    app.listen(PORT || 5000, () => console.log(`listening to the server`));
}).catch((err) => {
    console.log(`DB error - ${err}`)
})