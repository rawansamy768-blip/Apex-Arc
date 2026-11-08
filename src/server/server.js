const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// 1. Route لاستقبال رسائل AI Concierge
app.post('/api/ai/chat', (req, res) => {
  const { userPrompt } = req.body;
  console.log('Received AI prompt:', userPrompt);

  res.json({
    success: true,
    reply: `Received your inquiry: "${userPrompt}". Our architectural team is reviewing your request.`
  });
});

// 2. Route لاستقبال بيانات نموذج التواصل (Contact Form)
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  console.log('New Contact Form Submission:', { name, email, message });

  res.json({
    success: true,
    message: 'Form submitted successfully!'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});