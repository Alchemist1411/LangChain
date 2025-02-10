import express from 'express';
import { agentBuilder } from './index';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/api/chat', async (req: any, res: any) => {
    const { content } = req.body;

    if (!content) {
        return res.status(400).send({ error: 'Content is required' });
    }

    const messages = [{
        role: "user",
        content: content
    }];

    try {
        const result = await agentBuilder.invoke({ messages });
        res.send(result.messages);
    } catch (error) {
        res.status(500).send({ error: 'An error occurred while processing the request' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});