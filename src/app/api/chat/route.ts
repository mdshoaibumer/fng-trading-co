import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are Nexia, the official AI assistant for Future Next Gen (FNG). 
FNG specializes in providing premium refurbished HP enterprise printers, high-quality eco-friendly inks, and printer parts to businesses across the UAE and globally.
Your goal is to assist customers, answer questions about our products, and help them find the right office equipment. 
Tone: Professional, helpful, concise, and futuristic. 
Key Information:
- We offer enterprise-grade refurbished HP printers that save costs and reduce e-waste.
- We sell eco-friendly, high-yield ink cartridges.
- We offer comprehensive maintenance and repair services.
- If a customer wants to buy in bulk, encourage them to fill out the 'Request a Quote' form or contact sales via WhatsApp.
Keep your responses relatively brief and highly relevant. Do not hallucinate products we do not sell.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages array' }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      console.error('Missing OPENROUTER_API_KEY');
      return NextResponse.json({ error: 'AI service is not configured.' }, { status: 500 });
    }

    const payload = {
      model: 'openrouter/free', // Dynamically selects the best available free model
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages
      ]
    };

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://fng.com',
        'X-Title': 'FNG Platform',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('OpenRouter error:', errText);
      return NextResponse.json({ error: 'Failed to communicate with AI service' }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
