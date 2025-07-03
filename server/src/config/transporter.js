import nodemailer from "nodemailer"
import { configDotenv } from "dotenv";

configDotenv()

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
})



export default transporter;