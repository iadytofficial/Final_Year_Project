const axios = require('axios');

async function identifyPlant(base64Image) {
  const apiKey = process.env.GOOGLE_VISION_API_KEY;
  if (!apiKey) throw new Error('Vision API not configured');
  const url = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
  const body = {
    requests: [{
      image: { content: base64Image },
      features: [{ type: 'LABEL_DETECTION', maxResults: 10 }],
    }],
  };
  const { data } = await axios.post(url, body);
  return data;
}

async function chatbot(message, context) {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) throw new Error('Gemini API not configured');
  // Placeholder for actual Gemini client; using generic HTTP call pattern
  // Replace with official SDK if available in env
  const { data } = await axios.post('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    { contents: [{ parts: [{ text: `${context || ''}\nUser: ${message}` }] }] },
    { params: { key: apiKey } });
  return data;
}

module.exports = { identifyPlant, chatbot };
