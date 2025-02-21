import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';
import { agentBuilder } from "../ai-node";
const router = Router();
const sessions: { [key: string]: any[] } = {};

const MESSAGE_LIMIT = 10;

router.post('/chat', async (req: any, res: any) => {
    const { userId, content, threadId } = req.body;

    if (!userId || !content) {
        return res.status(400).json({ error: 'UserId and content are required' });
    }

    let currentThreadId = threadId;

    if (!currentThreadId) {
        currentThreadId = uuidv4();
    }

    if (!sessions[currentThreadId]) {
        sessions[currentThreadId] = [];
    }

    sessions[currentThreadId].push({ role: "user", content });

    try {
        console.log(`Messages before invoking agentBuilder for thread ${currentThreadId}:`, sessions[currentThreadId]);

        const result = await agentBuilder.invoke({ messages: sessions[currentThreadId] });

        console.log(`Messages after invoking agentBuilder for thread ${currentThreadId}:`, result.messages);

        const aiMessage = result.messages.find((msg: any) => msg.role === "assistant");
        if (aiMessage) {
            sessions[currentThreadId].push({ role: "assistant", content: aiMessage.content });
        }

        sessions[currentThreadId] = sessions[currentThreadId].slice(-MESSAGE_LIMIT);

        console.log(`Sending response for thread ${currentThreadId}:`, { threadId: currentThreadId, messages: result.messages });
        res.json({ threadId: currentThreadId, messages: result.messages });
    } catch (error) {
        console.error('Error occurred while processing the request:', error);
        res.status(500).json({ error: 'An error occurred while processing the request' });
    }
});

router.post("/dummy_chat", async (req: Request, res: Response) => {
  const message = req.body.message;
  try {
    const responseMessage = {
      uiType: "text",
      text: `${message} agent dummy chat response`
    };
    res.json({ response: responseMessage });
  } catch (error: any) {
    res.status(500).send(`Error: ${error.message}`);
  }
});

// Dummy Chart Endpoint – returns data for rendering a chart
router.post("/dummy_chart", async (req: Request, res: Response) => {
  const message = req.body.message;
  try {
    const responseMessage = {
      uiType: "chart",
      text: `Dummy chart response for: ${message}`,
      output: {
        chartType: "bar",
        labels: ["January", "February", "March"],
        data: [10, 20, 30]
      }
    };
    res.json({ response: responseMessage });
  } catch (error: any) {
    res.status(500).send(`Error: ${error.message}`);
  }
});

// Dummy Custom Transaction Endpoint – returns details for a custom tx UI
router.post("/dummy_customTx", async (req: Request, res: Response) => {
  const message = req.body.message;
  try {
    const responseMessage = {
      uiType: "customTx",
      text: `Dummy custom transaction response for: ${message}`,
      output: {
        receiverAddress: "0x99537334F44E532384Dd503fBB2fDFc4846641d4",
        amount: "0.01"
      }
    };
    res.json({ response: responseMessage });
  } catch (error: any) {
    res.status(500).send(`Error: ${error.message}`);
  }
});

export default router;