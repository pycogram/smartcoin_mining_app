import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import dotenv from 'dotenv';
import { userRoutes } from './routes/user';

dotenv.config({ path: path.resolve(__dirname, '../../.env') }); 

const app = express(); //instanciate an express obj to server with it

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