import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import EventHandler from './event-handler';

const app = express();
const port = process.env.PORT || 3000;

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  maxRetries: parseInt(process.env.OPENAI_MAX_RETRIES as string) || 1,
  timeout: parseInt(process.env.OPENAI_TIMOUT as string) || 20000,
});

app.use(express.json());

app.post('/chat', async (req, res) => {
  const { message } = req.body;

  try {
    // Create a new OpenAI thread
    const thread = await openai.beta.threads.create();

    // Handle OpenAI events
    const eventHandler = new EventHandler(openai);
    eventHandler.on('event', eventHandler.onEvent.bind(eventHandler));
    eventHandler.once('response', (responseMessage: string) => {
      res.json({ sessionId: thread.id, message: responseMessage });
    });

    // Create a new message in the thread
    if (message && message.length > 0) {
      await openai.beta.threads.messages.create(thread.id, {
        role: 'user',
        content: message,
      });
    } else {
      await openai.beta.threads.messages.create(thread.id, {
        role: 'user',
        content: 'Should I go outside Today?',
      });
    }

    const stream = await openai.beta.threads.runs.stream(thread.id, {
      assistant_id: process.env.ASSISTANT_ID as string,
    });

    for await (const event of stream) {
      eventHandler.emit('event', event);
    }
  } catch (error) {
    console.error('Error interacting with OpenAI or OpenWeather:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
