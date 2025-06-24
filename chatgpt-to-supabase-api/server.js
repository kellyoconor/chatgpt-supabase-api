const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
require('dotenv').config();

console.log('Starting server...');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

console.log('Supabase client initialized');

// API endpoint to save conversations
app.post('/save-conversation', async (req, res) => {
  try {
    const { topic, content, category, priority } = req.body;
    
    const { data, error } = await supabase
      .from('conversations')
      .insert([
        {
          topic: topic,
          content: content,
          category: category || 'general',
          priority: priority || 'medium',
          source: 'chatgpt',
          conversation_date: new Date().toISOString().split('T')[0],
          quarter: `Q${Math.ceil((new Date().getMonth() + 1) / 3)} ${new Date().getFullYear()}`
        }
      ]);

    if (error) throw error;
    
    res.json({ success: true, message: 'Conversation saved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

console.log('Server setup complete, attempting to listen...');
