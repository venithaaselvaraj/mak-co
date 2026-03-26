import axios from 'axios';
import dotenv from 'dotenv';
import { chatWithGemini } from './geminiService.js';
dotenv.config();

const WHATSAPP_API_URL = 'https://graph.facebook.com/v18.0';
const PHONE_ID = process.env.WHATSAPP_PHONE_ID;
const API_TOKEN = process.env.WHATSAPP_API_TOKEN;
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'textile_shop_verify_2024';

// Send WhatsApp message
export async function sendWhatsAppMessage(to, message) {
  try {
    const response = await axios.post(
      `${WHATSAPP_API_URL}/${PHONE_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to: to,
        type: 'text',
        text: { body: message },
      },
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('WhatsApp message sent:', response.data);
    return response.data;
  } catch (error) {
    console.error('WhatsApp Send Error:', error.response?.data || error.message);
    throw new Error('Failed to send WhatsApp message');
  }
}

// Send order notification to shop owner
export async function sendOrderNotification(ownerPhone, orderDetails) {
  const message = `🧵 *New Order Received!*\n\n` +
    `👤 *Buyer:* ${orderDetails.buyerName}\n` +
    `📍 *Address:* ${orderDetails.deliveryAddress}\n` +
    `📞 *Phone:* ${orderDetails.phone}\n` +
    `📦 *Product:* ${orderDetails.productName}\n` +
    `🔢 *Quantity:* ${orderDetails.quantity}\n` +
    `💰 *Amount:* ₹${orderDetails.totalAmount}\n` +
    `💳 *Payment:* ${orderDetails.paymentMethod}\n\n` +
    `Please review and accept/reject this order in your dashboard.`;

  return sendWhatsAppMessage(ownerPhone, message);
}

// Send order confirmation to customer
export async function sendOrderConfirmation(customerPhone, orderDetails) {
  const message = `✅ *Order Accepted – Your textile order is confirmed!*\n\n` +
    `📦 *Product:* ${orderDetails.productName}\n` +
    `🔢 *Quantity:* ${orderDetails.quantity}\n` +
    `💰 *Amount:* ₹${orderDetails.totalAmount}\n\n` +
    `Thank you for shopping with Textile AI Shop! 🧵\n` +
    `Your order will be delivered soon.`;

  return sendWhatsAppMessage(customerPhone, message);
}

// Webhook verification (GET)
export function verifyWebhook(req, res) {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('WhatsApp webhook verified');
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
}

// Webhook message handler (POST)
export async function handleWebhookMessage(req, res) {
  try {
    const body = req.body;

    if (body.object !== 'whatsapp_business_account') {
      return res.sendStatus(404);
    }

    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const messages = value?.messages;

    if (messages && messages.length > 0) {
      const msg = messages[0];
      const from = msg.from;
      const text = msg.text?.body;

      if (text) {
        console.log(`WhatsApp message from ${from}: ${text}`);

        // Send to Gemini AI and reply
        try {
          const aiReply = await chatWithGemini(text);
          await sendWhatsAppMessage(from, aiReply);
        } catch {
          await sendWhatsAppMessage(from, 
            '🧵 Thank you for your message! Our textile consultant will get back to you shortly.\n\nMeanwhile, you can browse our products at our website.');
        }
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Webhook Error:', error);
    res.sendStatus(500);
  }
}
