// require("dotenv").config({ path: "./env" }); // can give path too
// but it ruin the consistency of code, require......import......
import "dotenv/config";
// improved version
// import dotenv from "dotenv"; // but it will not work now, coz need it to config too
import connectDB from "./db/index.js"; // sometimes extentions(.js) are also important

// dotenv config
// dotenv.config({
//   path: "./env",
// });
// as this way is very freshly introduce, it is in experimental version so we need to specify that in in package.json
connectDB() // we are using async, which returns promise, so we have then and catch
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log();
    });
  })
  .catch((err) => {
    console.log("MONGODB connection failed!!", err);
  });
