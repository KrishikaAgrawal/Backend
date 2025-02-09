import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// SOME SETTINGS

app.use(express.json({ limit: "16kb" })); // express accepting json with size limit 16kb, otherwise server will crash if the json is big
app.use(
  express.urlencoded({
    extended: true, // allow to give objects of objects, most of the cases we don't nest the object, it will work fine without using extended
    limit: "16kb",
  })
);
app.use(express.static("public")); // serves static files (like HTML, CSS, JavaScript, images, etc.) from the "public" directory

// to set and access cookies from user browser from the server, to perform CRUD operation
app.use(cookieParser()); // can use options, but rarely in use
export { app };
