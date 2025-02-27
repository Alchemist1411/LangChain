import { Router } from "express";
import { v4 as uuidv4 } from 'uuid';
import { agentBuilder } from "../ai-node";
import mongoose from 'mongoose';
import Session from "../models/schema";
import dotenv from "dotenv";
import { ToolMessage } from "@langchain/core/messages"; // Add this import

dotenv.config();

const router = Router();
const MESSAGE_LIMIT = 20;

mongoose.connect(process.env.MONGODB_URI || "");

router.post('/chat', async (req: any, res: any) => {
  const { userId, content, threadId } = req.body;

  if (!userId || !content) {
    return res.status(400).json({ error: 'UserId and content are required' });
  }

  let currentThreadId = threadId || uuidv4();
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
    const additional_kwargs = last_message?.additional_kwargs || {};

    console.log("Additional Kwargs:", additional_kwargs);

    const toolCall = additional_kwargs.toolCall;
    const tool_names = toolCall && typeof toolCall === 'object' && 'name' in toolCall ? toolCall.name : null;
    const ui_type = toolCall && typeof toolCall === 'object' && 'uiType' in toolCall ? toolCall.uiType : null;
    const amount = additional_kwargs.amount || null;
    const walletAddress = additional_kwargs.walletAddress || null;

    res.json({
      threadId: currentThreadId,
      messages: last_message.content,
      uiType: ui_type,
      tool_calls: tool_names,
      amount: amount,
      walletAddress: walletAddress
    });

  } catch (error) {
    console.error('Error occurred while processing the request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;