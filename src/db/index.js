import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    ); // process -> it is the reference of current running application's process
    // mongoose gives a return object, connectionInstance -> have response that is returning after the connection, contains loads of information

    console.log(
      `\n MongoDB connected!! DB HOST : ${connectionInstance.connection.host}`
    ); // to know the host (mongodb url) we are getting connected
  } catch (error) {
    console.log("MONGODB connection error", error);
    process.exit(1); // instead of throwing error we are exiting the process
  }
};

export default connectDB;
