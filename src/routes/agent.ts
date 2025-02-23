import { Router } from "express";
import { v4 as uuidv4 } from 'uuid';
import { agentBuilder } from "../ai-node";
import mongoose from 'mongoose';
import Session from "../models/schema";
import dotenv from "dotenv";

dotenv.config();

const router = Router();
const MESSAGE_LIMIT = 20;

mongoose.connect(process.env.MONGODB_URI || "");

router.post('/chat', async (req: any, res: any) => {
  const { userId, content, threadId } = req.body;

  if (!userId || !content) {
    return res.status(400).json({ error: 'UserId and content are required' });
  }

  let currentThreadId = threadId;

  if (!currentThreadId) {
    currentThreadId = uuidv4();
  }

  let session = await Session.findOne({ threadId: currentThreadId });

  if (!session) {
    session = new Session({ userId, threadId: currentThreadId, messages: [], aiResponses: [] });
  }

  session.messages.push({ role: "user", content });

  try {
    console.log(`Messages before invoking agentBuilder for thread ${currentThreadId}:`, session.messages);

    const result = await agentBuilder.invoke({ messages: session.messages });

    console.log(`Messages after invoking agentBuilder for thread ${currentThreadId}:`, result.messages);

    session.aiResponses.push({ role: "assistant", response: result.messages });

    session.messages = session.messages.slice(-MESSAGE_LIMIT);
    await session.save();

    const last_message = result.messages[result.messages.length - 1];
    const ui_type = (last_message.additional_kwargs?.uiType as string[] | undefined)?.[0];

    console.log("UI Type:", ui_type);

    const message = last_message.content;

    res.json({ threadId: currentThreadId, messages: message, uiType: ui_type });

  } catch (error) {
    console.error('Error occurred while processing the request:', error);
    res.status(500).json({ error: 'An error occurred while processing the request' });
  }
});


export default router;