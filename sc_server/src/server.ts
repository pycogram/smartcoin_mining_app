import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') }); 

import express from 'express';
import mongoose from 'mongoose';
import { userRoutes } from './routes/user';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

//instanciate an express obj to server with it
const app = express(); 

// middleware to parse cookies
app.use(cookieParser());

// security middleware to set various HTTP headers
app.use(helmet()); 
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

app.get('/', (req, res) => {
    res.send('welcome to smartcoin');               
});

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