import express from "express";
import { generateResponse } from "../geminiService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const reply = await generateResponse(message);

    res.json({ reply });
  } catch (error) {
    console.error("Route Error:", error);
    res.status(500).json({ reply: "Samyak is currently busy with the artisan consultation. 🧵" });
  }
});

export default router;
