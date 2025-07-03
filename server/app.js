import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import createDBConnection from './src/config/connectDB.js'
import authRoutes from './src/routes/auth.route.js'

config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT;

createDBConnection().then(()=>{
app.listen(PORT, (error) => {
    if (error) {
        console.warn(`🔴 server is not running`);
    }
    console.log(`✅ server started http://localhost:${PORT}`);
})
});

