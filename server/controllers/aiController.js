const { identifyPlant, chatbot } = require('../services/ai');

async function identify(req, res, next) {
  try {
    const { image } = req.body;
    const result = await identifyPlant(image);
    return res.json(result);
  } catch (err) { return next(err); }
}

async function chat(req, res, next) {
  try {
    const { message, context } = req.body;
    const result = await chatbot(message, context || '');
    return res.json(result);
  } catch (err) { return next(err); }
}

module.exports = { identify, chat };
