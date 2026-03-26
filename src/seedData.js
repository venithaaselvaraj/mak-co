import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

async function seedBoutique() {
    console.log("🕯️ Initiating Sacred Seed Process...");

    try {
        // 1. One Sacred Order
        const orderRef = await addDoc(collection(db, 'orders'), {
            orderId: 'SACRED-DEMO-01',
            buyerName: 'Aditya Sarma',
            items: [
                { name: 'Kanchipuram Silk Saree (Gold Zari)', quantity: 1, price: 18500 }
            ],
            totalAmount: 18500,
            deliveryAddress: '12 Temple St, Madurai, TN',
            status: 'delivered', // Delivered so we can exchange it
            userId: 'demo_user_123',
            createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
            isWhatsApp: false
        });
        console.log("✅ One Sacred Order Manifested.");

        // 2. One Exchange Request
        await addDoc(collection(db, 'returns'), {
            orderId: 'SACRED-DEMO-01',
            productName: 'Kanchipuram Silk Saree (Gold Zari)',
            requestType: 'exchange',
            reason: 'Fabric shade variance - seeking a deeper Vedic Red.',
            status: 'in-transit',
            userId: 'demo_user_123',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            photoUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800'
        });
        console.log("✅ One Heritage Restoration Request Logged.");
        
        console.log("🌟 Boutique Sanctification Complete.");
    } catch (err) {
        console.error("❌ Sacred Seed Interrupted:", err);
    }
}

// Note: This script is intended to be called within the React project context if needed, 
// but here it serves as a "blueprint" for the setup.
seedBoutique();
