import { tool } from "@langchain/core/tools";
import axios from "axios";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const transactionSchema = z.object({
    walletAddress: z.string().describe("The wallet address to get transaction history for."),
});

const getTransactionHistory = tool(
    async ({ walletAddress }) => {
        const SONIC_SCAN_API_KEY = process.env.SONIC_SCAN_API_KEY || "";
        const SONIC_SCAN_API_URL = 'https://api-testnet.sonicscan.org/api';

        try {
            const response = await axios.get(SONIC_SCAN_API_URL, {
                params: {
                    module: 'account',
                    action: 'txlist',
                    address: walletAddress,
                    startblock: 0,
                    endblock: 99999999,
                    page: 1,
                    offset: 10,
                    sort: 'asc',
                    apikey: SONIC_SCAN_API_KEY
                }
            });

            if (response.data.status === '1' && response.data.result.length > 0) {
                const transactions = response.data.result;
                const formattedTxs = transactions.map((tx: any, index: number) => {
                    return `${index + 1}. Hash: ${tx.hash.substring(0, 10)}...
             From: ${tx.from.substring(0, 10)}...
             To: ${tx.to.substring(0, 10)}...
             Value: ${tx.value} SONIC
             Time: ${new Date(parseInt(tx.timeStamp) * 1000).toLocaleString()}`;
                }).join('\n\n');

                return {
                    uiType: "trnxHistory",
                    text: `Transaction history for ${walletAddress}:\n\n${formattedTxs}`,
                    trxn: transactions
                };
            } else {
                return {
                    uiType: "text",
                    text: `No transactions found for wallet ${walletAddress}.`,
                };
            }
        } catch (error: any) {
            return {
                uiType: "text",
                text: `Failed to fetch transaction history: ${error.message}`,
            };
        }
    },
    {
        name: "getTransactionHistory",
        description: "Get the transaction history for a specified wallet address on the Sonic blockchain.",
        schema: transactionSchema,
    }
);

export default getTransactionHistory;