import nodemailer from 'nodemailer';

if (!process.env.EMAIL_ADDRESS || !process.env.EMAIL_PASSWORD) {
  throw new Error("EMAIL credentials missing in .env");
}

const Transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_ADDRESS, 
        pass: process.env.EMAIL_PASSWORD
    }
});

export default Transport;