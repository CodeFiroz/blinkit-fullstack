import mongoose from "mongoose";

const createDBConnection = async ()=>{
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI);

        if(!connection){
            console.warn(`🔴 [DB_CONNECTION] database connection error.`);
        }

        console.log(`🚀 Database connection estabilished.`);
        
        
    } catch (error) {
        console.warn(`🔴 [DB_CONNECTION] database connection failed.`);
        console.error(error);
    }
}

export default createDBConnection;