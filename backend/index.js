require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');

const app = express();

app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.get('/', (req, res) => {
  res.send('Kallan backend is running');
});

app.post('/api/check', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const prompt = `You are a cybersecurity fraud detection expert. Analyze the following message and determine if it is a scam or phishing attempt. Respond ONLY with valid JSON in this exact format, no extra text, no markdown formatting: { "verdict": "SCAM" or "SAFE", "confidence": <number 0-100>, "reasons": ["reason1", "reason2", "reason3"] }. Red flags to look for: urgency or threats like 'act now' or 'account suspended', requests for OTP/password/bank details, suspicious or shortened links, spoofed sender identity, too-good-to-be-true offers or fake prizes, poor grammar mimicking official communication. Message to analyze: ${message}`;

    let completion;
    try {
      completion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.1-8b-instant',
      });
    } catch (modelErr) {
      if (modelErr.status === 404 || modelErr.message?.includes('model_not_found') || modelErr.message?.includes('does not exist')) {
        completion = await groq.chat.completions.create({
          messages: [{ role: 'user', content: prompt }],
          model: 'groq/compound-mini',
        });
      } else {
        throw modelErr;
      }
    }

    const aiContent = completion.choices[0]?.message?.content || '';

    // Strip markdown code block formatting if present
    let cleanedContent = aiContent.trim();
    if (cleanedContent.startsWith('```')) {
      cleanedContent = cleanedContent
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/\s*```$/, '');
    }

    const jsonResult = JSON.parse(cleanedContent);
    res.json(jsonResult);
  } catch (error) {
    console.error('Error checking message:', error);
    res.status(500).json({ error: error.message || 'An error occurred while analyzing the message' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
