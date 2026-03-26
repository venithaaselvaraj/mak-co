import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { chatWithGemini, generateDesignIdea } from './geminiService.js';
import { verifyWebhook, handleWebhookMessage, sendOrderNotification, sendOrderConfirmation } from './whatsappService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// ==================== CHATBOT API ====================

app.post('/api/chatbot', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    const reply = await chatWithGemini(message);
    res.json({ reply });
  } catch (error) {
    console.error('Chatbot Error:', error.message);
    res.status(500).json({ error: 'Failed to get AI response', reply: 'Sorry, I\'m having trouble right now. Please try again!' });
  }
});

app.post('/api/generate-design', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    const design = await generateDesignIdea(prompt);
    res.json({ design });
  } catch (error) {
    console.error('Design Generation Error:', error.message);
    res.status(500).json({ error: 'Failed to generate design idea' });
  }
});

// ==================== WHATSAPP API ====================

// Webhook verification
app.get('/api/whatsapp/webhook', verifyWebhook);

// Webhook message handler
app.post('/api/whatsapp/webhook', handleWebhookMessage);

// Send order notification
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

// Send order confirmation
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

// ==================== HEALTH CHECK ====================

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

// ==================== STATIC FILES ====================

// Serve static assets in production
app.use(express.static(path.join(__dirname, '../dist')));

// Catch-all route for client-side routing
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

// ==================== START SERVER ====================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🧵 Textile AI Server running on port ${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
  console.log(`   Gemini: ${process.env.GEMINI_API_KEY ? '✅ Configured' : '❌ Not configured'}`);
  console.log(`   WhatsApp: ${process.env.WHATSAPP_API_TOKEN ? '✅ Configured' : '❌ Not configured'}\n`);
});
