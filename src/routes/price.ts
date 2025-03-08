import { Router, Request, Response } from "express";

const router = Router();

router.post('/getprice', async (req: Request, res: Response): Promise<void> => {
    console.log('Request received to get price for token:', req.body.tokenName);
    const tokenName = req.body.tokenName;
    try {
        const response = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${tokenName}&vs_currencies=usd`,
            {
                headers: {
                    accept: 'application/json'
                }
            }
        );
        const data = await response.json();
        const price = data[tokenName]?.usd;
        console.log('Fetched price for token ' + tokenName, price);
        res.json({ price });
    } catch (error) {
        console.error("Error occurred while processing the request:", error);
        res.status(500).send("Internal Server Error");
    }
});

export default router;