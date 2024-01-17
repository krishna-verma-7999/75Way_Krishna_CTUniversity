import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import compression from "compression";
import * as dotenv from "dotenv";
import mongoose from "mongoose";

import authenticationRoutes from "./routes/authentication";
import userRoutes from "./routes/user";
import adminRoutes from "./routes/admin";

import { birthdayCronJob } from "./cronJob/birthday";
import { aniverseryCronJob } from "./cronJob/aniversery";

dotenv.config();
const app = express();

// Middlewares
app.use(
  cors({
    credentials: true,
  })
);
app.use(compression());
app.use(bodyParser.json());

birthdayCronJob();
aniverseryCronJob();

// Routes
app.use("/", authenticationRoutes);
app.use("/", userRoutes);
app.use("/", adminRoutes);

// Making Mongodb connection
// console.log(process.env.MONGODB_URL);
const url = process.env.MONGODB_URL;
mongoose.Promise = Promise;
mongoose.connect(url);
mongoose.connection.on("error", (error: Error) => console.log(error));

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
