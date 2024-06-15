import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import EventHandler from './event-handler';
import { WebSocketServer } from 'ws';

const app = express();
const port = process.env.WS_PORT || 3001;

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  maxRetries: parseInt(process.env.OPENAI_MAX_RETRIES as string) || 1,
  timeout: parseInt(process.env.OPENAI_TIMOUT as string) || 20000,
});

app.use(express.json());

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', async (message: string) => {
    const parsedMessage = JSON.parse(message);
    const { sessionId, userMessage } = parsedMessage;

    try {
      let threadId: string;

      if (!sessionId) {
        // Create a new OpenAI thread
        const thread = await openai.beta.threads.create();
        threadId = thread.id;
      } else {
        threadId = sessionId;
      }

      // Handle OpenAI events
      const eventHandler = new EventHandler(openai);
      eventHandler.on('event', eventHandler.onEvent.bind(eventHandler));
      eventHandler.once('response', (responseMessage: string) => {
        ws.send(
          JSON.stringify({ sessionId: threadId, message: responseMessage }),
        );
      });

      // Create a new message in the thread
      if (userMessage && userMessage.length > 0) {
        await openai.beta.threads.messages.create(threadId, {
          role: 'user',
          content: userMessage,
        });
      } else {
        await openai.beta.threads.messages.create(threadId, {
          role: 'user',
          content: 'Should I go outside Today?',
        });
      }

      const stream = await openai.beta.threads.runs.stream(threadId, {
        assistant_id: process.env.ASSISTANT_ID as string,
      });

      for await (const event of stream) {
        eventHandler.emit('event', event);
      }
    } catch (error) {
      console.error('Error interacting with OpenAI or OpenWeather:', error);
      ws.send(JSON.stringify({ error: 'Internal server error' }));
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});
