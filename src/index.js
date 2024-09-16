import mongoose from "mongoose";
import { DB_NAME } from "./constants";

import express from "express";
const app = express()(
  /* 
function connectDB() {   
}
connectDB()
 */

  // to invoke it immediately use iffy (immediately execute the fn)
  // (()=>) ()
  // ;(()=>) ()  -> more professional common approach, it just to complete the previous stmt
  async () => {
    try {
      await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
      // listners after connection of DB, like
      app.on("error", (error) => {
        console.log("Error:", error);
        throw error;
      });

      app.listen(process.env.PORT, () => {
        console.log(`App is listening on port ${process.env.PORT}`);
      });
    } catch (error) {
      console.error("ERROR:", error);
      throw err;
    }
  }
)();

// process.env.MONGODB_URI -> for database connection
// DB_NAME -> db name
