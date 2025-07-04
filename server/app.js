import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import createDBConnection from './src/config/connectDB.js'
import authRoutes from './src/routes/auth.route.js'
import addressRoutes from './src/routes/address.route.js'
import categoryRoutes from './src/routes/category.route.js'

config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/category', categoryRoutes);

const PORT = process.env.PORT;

createDBConnection().then(()=>{
app.listen(PORT, (error) => {
    if (error) {
        console.warn(`🔴 server is not running`);
    }
    console.log(`✅ server started http://localhost:${PORT}`);
})
});

