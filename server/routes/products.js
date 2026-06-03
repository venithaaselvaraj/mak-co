import express from "express";
import multer from "multer";
import path from "path";
import Product from "../models/Product.js";

const router = express.Router();

// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "server/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `sacred_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit for high-res heritage images
});

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// POST a new product
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, price, category, description } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    const newProduct = new Product({
      name,
      price: Number(price),
      category,
      description,
      imageUrl,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: "Failed to save product. Samyak is troubleshooting the digital weave. 🧵" });
  }
});

export default router;
