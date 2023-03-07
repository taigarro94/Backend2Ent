import express from "express";
import { engine } from "express-handlebars";
import mongoose from "mongoose";
import { Server } from "socket.io";
import productRouter from "./routes/product.routes.js";
import cartRouter from "./routes/cart.routes.js";
import chatRouter from "./routes/chat.routes.js";
import viewsRouter from "./routes/views.routes.js";
import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 8080;
const mongoURL = `mongodb+srv://${process.env.USER_MONGO}:${process.env.PASS_MONGO}@ecommercecluster.znfvobx.mongodb.net/${process.env.DB_MONGO}?retryWrites=true&w=majority`;

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");
app.use(express.static("public"));

const server = app.listen(PORT, () => {
  console.log(`Server OK en puerto ${PORT}`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Contactar DB
mongoose.set("strictQuery", false);
mongoose.connect(mongoURL, (err) => {
  if (err) {
    console.log("Fallo de conexión DB", err.message);
    process.exit();
  } else {
    console.log("Conectado a la BD");
  }
});

const socketIo = new Server(server);

socketIo.on("connection", (socket) => {
  console.log("Nuevo Usuario conectado");

  socket.on("mensaje", (data) => {
    socketIo.emit("mensajeServidor", data);
    axios.post("http://localhost:8080/chat", data);
  });

  socket.on("escribiendo", (data) => {
    socket.broadcast.emit("escribiendo", data);
  });
});

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/viewProducts", viewsRouter);
app.use("/chat", chatRouter);