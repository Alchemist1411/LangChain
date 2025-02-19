import express from 'express';
import { agentBuilder } from './ai-node';
import { v4 as uuidv4 } from 'uuid';
import TavilySearch from './utils/tavilySearch';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const sessions: { [key: string]: any[] } = {};

const MESSAGE_LIMIT = 10;

app.post('/api/chat', async (req: any, res: any) => {
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

app.post('/api/search', async (req, res) => {
    const query = req.body.query;
    try {
        const result = await TavilySearch.invoke({
            input: query,
        });
        res.json(result);
    } catch (error) {
        console.error("Error occurred while processing the request:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(port, () => {
    console.log(`Service is running on port: ${port}`);
});