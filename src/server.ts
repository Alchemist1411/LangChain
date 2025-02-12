import express from 'express';
import { agentBuilder } from './index';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const sessions: { [key: string]: any[] } = {};

const MESSAGE_LIMIT = 10;

app.post('/api/chat', async (req: any, res: any) => {
    const { userId, content } = req.body;

    if (!userId || !content) {
        return res.status(400).json({ error: 'UserId and content are required' });
    }

    if (!sessions[userId]) {
        sessions[userId] = [];
    }

    sessions[userId].push({ role: "user", content });

    try {
        console.log(`Messages before invoking agentBuilder for user ${userId}:`, sessions[userId]);

        const result = await agentBuilder.invoke({ messages: sessions[userId] });

        console.log(`Messages after invoking agentBuilder for user ${userId}:`, result.messages);

        sessions[userId] = result.messages.slice(-MESSAGE_LIMIT);

        res.json({ messages: result.messages });
    } catch (error) {
        console.error('Error occurred while processing the request:', error);
        res.status(500).json({ error: 'An error occurred while processing the request' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});