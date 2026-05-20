import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from 'path';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";
import { verifyWebhook, handleWebhookMessage, sendOrderNotification, sendOrderConfirmation } from './whatsappService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Atlas Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mkv_sacred_db';
mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB Atlas Sacred Vault');
    
    // Auto-seed default admin user if database is fresh
    try {
      const User = mongoose.model('User');
      const adminExists = await User.findOne({ email: 'admin@mak.co' });
      if (!adminExists) {
        const adminUser = new User({
          name: 'MAK Sacred Administrator',
          email: 'admin@mak.co',
          password: 'password123',
          phone: '+917598137660',
          role: 'admin'
        });
        await adminUser.save();
        console.log('🌟 Seeded Default Admin User: admin@mak.co');
      }
    } catch (seedErr) {
      console.error('⚠️ Admin Seeding Skipped:', seedErr.message);
    }
  })
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

// WhatsApp Webhook Routes
app.get('/api/whatsapp/webhook', verifyWebhook);
app.post('/api/whatsapp/webhook', handleWebhookMessage);

// WhatsApp Utility Routes
app.post('/api/whatsapp/notify-order', async (req, res) => {
  try {
    const { ownerPhone, orderDetails } = req.body;
    await sendOrderNotification(ownerPhone, orderDetails);
    res.json({ success: true, message: 'Order notification sent' });
  } catch (error) {
    console.error('Order notification error:', error.message);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

app.post('/api/whatsapp/confirm-order', async (req, res) => {
  try {
    const { customerPhone, orderDetails } = req.body;
    await sendOrderConfirmation(customerPhone, orderDetails);
    res.json({ success: true, message: 'Order confirmation sent' });
  } catch (error) {
    console.error('Order confirmation error:', error.message);
    res.status(500).json({ error: 'Failed to send confirmation' });
  }
});

// Health Checks
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    services: {
      gemini: !!process.env.GEMINI_API_KEY,
      whatsapp: !!(process.env.WHATSAPP_API_TOKEN && process.env.WHATSAPP_PHONE_ID),
    },
    timestamp: new Date().toISOString(),
  });
});

// Production Static Files
app.use(express.static(path.join(__dirname, '../dist')));
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🧵 M A K & CO Backend Server is active on port ${PORT}`);
  console.log(`   Samyak (Chat): http://localhost:${PORT}/api/chat`);
  console.log(`   Health: http://localhost:${PORT}/api/health\n`);
});
