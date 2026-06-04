// api/chat.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'API Key not configured in Vercel' });
    }

    const model = "gemini-2.5-flash";
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    
    const systemPrompt = "Você é um assistente virtual especialista na ODS 10 (Redução das Desigualdades) e em Inclusão Digital. Responda de forma acessível, empática, direta, usando português claro e acolhedor. Incentive o usuário a apoiar a causa.";

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: message }] }],
                system_instruction: { parts: [{ text: systemPrompt }] }
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        const botText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Desculpe, não consegui processar sua dúvida.";
        res.status(200).json({ text: botText });

    } catch (error) {
        console.error("Erro na função da API:", error);
        res.status(500).json({ error: "Erro interno ao processar a requisição" });
    }
}
