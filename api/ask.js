import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const { question } = req.body;

  if (!question || typeof question !== "string" || question.trim() === "") {
    return res.status(400).json({ error: "Field 'question' is required." });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "OPENAI_API_KEY is not configured." });
  }

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant for a baby monitoring app called LullaBeA. Answer questions about baby health, sleep, and development.",
        },
        {
          role: "user",
          content: question.trim(),
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const answer = completion.choices[0].message.content;

    return res.status(200).json({ question: question.trim(), answer });
  } catch (error) {
    console.error("OpenAI API error:", error);

    if (error.status === 401) {
      return res.status(500).json({ error: "Invalid OpenAI API key." });
    }
    if (error.status === 429) {
      return res
        .status(429)
        .json({ error: "Rate limit exceeded. Try again later." });
    }

    return res
      .status(500)
      .json({ error: "Failed to get answer. Please try again." });
  }
}
