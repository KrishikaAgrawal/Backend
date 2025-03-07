import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
// 
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// IMPORT ROUTES
import userRouter from "./routes/user.routes.js";

// ROUTE DECLARATION 

app.use("/api/v1/users", userRouter); // passing name of route, and which router to activate on it
export { app };
