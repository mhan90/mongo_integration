import express from "express";
import { Server as HttpServer } from "http";
import { Server as SocketServer } from "socket.io";
import handlebars from "express-handlebars";
import __dirname from "./config/__dirname.js";
import mainRouter from "./routes/main.routes.js";

// Setting express 
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Static content
app.use(express.static(`${__dirname}/public`));
// Handlebars config
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");
//  Setting up server with http
const httpServer = HttpServer(app);
// Socket wrapper
const io = new SocketServer(httpServer);
// Middleware
app.use((req, res, next) => {
    req.io = io;
    // console.log(`[${req.method}] ${req.url}`);
    next();
});
//  Router
app.use("/", mainRouter);
// Socket methods
io.on("connection", (socket) => {
    console.log(`Client ${socket.id} connected.`);
});
// Listen
httpServer.listen(8080, () => {
    console.log("Server is now listening at port: 8080.");
});