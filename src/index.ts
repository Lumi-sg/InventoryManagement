import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import http from "http";
import path from "path";

import mongoose from "mongoose";
import catalogRouter from "./router/catalog";
import indexRouter from "./router/index";

const app = express();

app.use(
	cors({
		credentials: true,
	})
);

app.use(compression());
app.use(bodyParser.json());

//DB Stuff
const MONGODBURL = process.env.MONGODBURL;
if (!MONGODBURL) {
	console.error("MONGODBURL environment variable is not set.");
	process.exit(1); // Exit the application with an error code.
}
mongoose.set("strictQuery", false);
mongoose.Promise = Promise;
mongoose.connect(MONGODBURL);

// The application now uses MONGODBURL as the MongoDB connection URL.

//Mongo connection info
mongoose.connection.on("error", (error: Error) => {
	console.log(error);
});
mongoose.connection.on("open", () => {
	console.log("Connected to MongoDB");
});

mongoose.connection.on("close", () => {
	console.log("Disconnected from MongoDB");
});

//View Engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// //Middleware

// Default route
app.use("/", indexRouter);
app.use("/catalog", catalogRouter);

const server = http.createServer(app);

server.listen(8080, () => {
	console.log("Server running on http://localhost:8080");
});
