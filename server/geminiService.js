import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'demo-key');

const TEXTILE_SYSTEM_PROMPT = `You are "Samyak", the Heritage Textile Consultant for M A K & CO.
Your goal is to assist devotees in finding the perfect "Sacred Weave" while educating them on the boutique's specialized offerings.

**SPECIAL OFFERS TO PROMOTE:**
1. 🎁 Sacred Welcome: 10% OFF on your very first order (Use Code: WELCOME10).
2. 🛕 Devotee Bulk Tier: 15% OFF for temple bulk orders (minimum 50 quantities).
3. ♻️ Heritage Exchange: Bring your old silk sarees for a 20% valuation credit.

**OUR MASTERWORK COLLECTIONS:**
- ✨ Premium Kanchipuram: Hand-woven pure silk with authentic gold zari.
- 🕉️ Banarasi Hub: Intricate silver/gold brocade, perfect for grand rituals.
- 🧘 Temple Madisar: Traditional 9-yard sarees for ultimate sanctity.
- 🍃 Pure Linen: Eco-friendly, breathable, and elegant for daily worship.
- 👘 Ghoti/Vasti Set: Pure white cotton or silk panchakacham with gold border.

**SERVICE PHILOSOPHY:**
- Maintain a tone that is respectful, artisan-focused, and heritage-driven.
- Tell users they can "Place Inquiries via WhatsApp" for personalized artisan consultation.
- Format responses with 🧶 bullet points and **bold** highlights.`;

// Try models in order of preference
const MODEL_LIST = [
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash-8b',
  'gemini-1.5-pro-latest',
  'gemini-pro',
];

export async function generateResponse(userMessage) {
  for (const modelName of MODEL_LIST) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(`${TEXTILE_SYSTEM_PROMPT}\n\nUser Question: ${userMessage}`);
      const response = await result.response;
      console.log(`✅ Gemini responded using model: ${modelName}`);
      return response.text();
    } catch (error) {
      console.warn(`⚠️ Model "${modelName}" failed: ${error.message}`);
      // Try next model
    }
  }
  
  // All models failed — return intelligent fallback
  console.error("❌ All Gemini models failed.");
  return getSmartFallback(userMessage);
}

function getSmartFallback(message) {
  const msg = message.toLowerCase();
  if (msg.includes('offer') || msg.includes('discount')) {
    return "🎁 **Sacred Offers:**\n\n🧶 **WELCOME10** — 10% OFF your first order\n🛕 **Bulk Tier** — 15% OFF on temple orders (50+ items)\n♻️ **Heritage Exchange** — 20% credit for old silk sarees\n\nContact us via WhatsApp to avail any offer!";
  }
  if (msg.includes('saree') || msg.includes('silk') || msg.includes('kanchipuram')) {
    return "✨ **Our Silk Sarees:**\n\n🧶 **Premium Kanchipuram** — Pure silk with gold zari, temple-grade sanctity\n🕉️ **Banarasi Hub** — Silver/gold brocade for grand rituals\n🧘 **Temple Madisar** — Traditional 9-yard sarees\n\nInquire via WhatsApp for pricing and customization!";
  }
  if (msg.includes('ghoti') || msg.includes('vasti') || msg.includes('dhoti')) {
    return "👘 **Heritage Ghoti/Vasti Sets:**\n\n🧶 Pure white cotton panchakacham with thick gold zari border\n🧶 Available in silk and cotton varieties\n🧶 Specifically designed for temple rituals and Vedic conduct\n\nPlace your inquiry via WhatsApp for custom sizing!";
  }
  if (msg.includes('price') || msg.includes('cost')) {
    return "💰 **Pricing Guide:**\n\n🧶 Pure Linen Angavastram — from ₹1,500\n🧶 Temple Madisar — from ₹8,000\n🧶 Kanchipuram Silk Saree — from ₹15,500\n🧶 Banarasi Silk — from ₹12,000\n\nUse code **WELCOME10** for 10% off your first order!";
  }
  return "🙏 **Namaste!** I am Samyak, your Heritage Textile Consultant.\n\nI can help you with:\n🧶 **Saree types** — Kanchipuram, Banarasi, Madisar\n🧶 **Ghoti/Vasti sets** — for temple rituals\n🧶 **Sacred Offers** — discounts and exchanges\n🧶 **WhatsApp Inquiry** — direct artisan consultation\n\nWhat would you like to know?";
}
