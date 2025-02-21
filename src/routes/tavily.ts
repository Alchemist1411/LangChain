import { Router } from "express";
import TavilySearch from "../utils/tavilySearch";

const router = Router();
router.post('/search', async (req, res) => {
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

export default router;