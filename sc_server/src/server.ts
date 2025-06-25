import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { userRoutes } from './routes/user';

dotenv.config({ path: path.resolve(__dirname, '../../.env') }); 

const app = express(); //instanciate an express obj to server with it

// endpoint and route handlers

app.use('/api/user', userRoutes)

app.get('/', (req, res) => {
    res.send('welcome to smartcoin');               
});

app.listen(process.env.PORT || 5000, () => console.log("listening to the server"));