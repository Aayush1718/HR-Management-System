import mongoose, { trusted } from "mongoose";
import {DB_NAME} from "../constants.js";


const dbConnect = async() => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDb Connected! , DbHost : ${connectionInstance.connection.host}`);
    
    } catch (err) {
        console.log("Error:", err);
        throw err;
    }
  }


export default dbConnect;  