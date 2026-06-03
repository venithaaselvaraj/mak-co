import express from "express";
import { getAIRecommendations } from "../geminiService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const preferences = req.body;
    
    if (!preferences || Object.keys(preferences).length === 0) {
      return res.status(400).json({ error: "User preferences are required" });
    }

    const recommendations = await getAIRecommendations(preferences);

    res.json(recommendations);
  } catch (error) {
    console.error("Recommendation Route Error:", error);
    res.status(500).json({ error: "Samyak is currently unable to consult. Please try again later." });
  }
});

export default router;
