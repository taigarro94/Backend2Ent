import { Router } from "express";
import { chatModel } from "../models/chat.model.js";

const router = Router();

router.get("/", async (req, res) => {
  res.render("chat", {});
});

router.get("/messages", async (req, res) => {
  try {
    const messages = await chatModel.find();
    res.send(messages);
  } catch (err) {
    req.statusCode(500).send(err.message);
  }
});

router.post("/", async (req, res) => {
  const message = req.body;
  const response = await chatModel.create(message);
  res.send(response);
});

export default router;