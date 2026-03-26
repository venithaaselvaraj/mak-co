import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'demo-key');

const TEXTILE_SYSTEM_PROMPT = `You are a specialized Textile AI Assistant for a textile shop. You are an expert in:
- All types of fabrics (cotton, silk, linen, polyester, wool, chiffon, georgette, velvet, satin, etc.)
- Indian textiles (Kanchipuram silk, Banarasi, Chanderi, Pochampally, Bandhani, etc.)
- Textile care and maintenance
- Fashion trends and seasonal recommendations
- Color theory and fabric pairing
- Pricing guidance and quality assessment
- Sustainable and eco-friendly textiles

Always be helpful, informative, and provide detailed answers about textiles.
Use emojis where appropriate to make responses engaging.
Format responses with bullet points and bold text for key information.
If asked about non-textile topics, politely redirect to textile-related conversations.`;

export async function chatWithGemini(userMessage) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: 'You are a textile shop AI assistant. Respond accordingly.' }] },
        { role: 'model', parts: [{ text: 'I understand! I\'m your Textile AI Assistant, ready to help with fabrics, designs, and textile queries. 🧵' }] },
      ],
    });

    const result = await chat.sendMessage(`${TEXTILE_SYSTEM_PROMPT}\n\nUser Query: ${userMessage}`);
    return result.response.text();
  } catch (error) {
    console.error('Gemini API Error:', error.message);
    throw new Error('Failed to get AI response');
  }
}

export async function generateDesignIdea(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(
      `As a textile design expert, describe in vivid detail a design concept for: ${prompt}.
      Include:
      - Color palette suggestions
      - Pattern description
      - Fabric recommendations
      - Suitable occasions
      - Styling tips
      Format with emojis and structured sections.`
    );
    return result.response.text();
  } catch (error) {
    console.error('Gemini Design Generation Error:', error.message);
    throw new Error('Failed to generate design idea');
  }
}
