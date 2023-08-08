import express from "express";
import mongoose from "mongoose";
import productsRouter from "./routes/products.js";
import cartsRouter from "./routes/carts.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const conn = await mongoose.connect(process.env.MONGODB_URL);
// conn.then(() => console.log("Connected to MongoDB!"));
// conn.catch((e) => console.log(e));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.listen(8080, () => {
  console.log("Server is now listening at port: 8080.");
});
