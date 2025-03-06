import { tool } from "@langchain/core/tools";
import axios from "axios";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const totalTransactionsSchema = z.object({
    address: z.string().describe("The wallet address to get the total number of transactions for."),
});

const getTotalTransactions = tool(
    async ({ address }) => {
        const SONIC_SCAN_API_KEY = process.env.SONIC_SCAN_API_KEY || "";
        const SONIC_SCAN_API_URL = 'https://api.sonicscan.org/api';

        try {
            const response = await axios.get(SONIC_SCAN_API_URL, {
                params: {
                    module: 'proxy',
                    action: 'eth_getTransactionCount',
                    address: address,
                    tag: 'latest',
                    apikey: SONIC_SCAN_API_KEY
                }
            });

            if (response.data.result) {
                const transactionCountHex = response.data.result;
                const transactionCount = parseInt(transactionCountHex, 16);
                return {
                    uiType: "text",
                    text: `Total number of transactions for address ${address}: ${transactionCount}`,
                };
            } else {
                return {
                    uiType: "text",
                    text: `No transaction count found for address ${address}.`,
                };
            }
        } catch (error: any) {
            return {
                uiType: "text",
                text: `Failed to fetch total transactions: ${error.message}`,
            };
        }
    },
    {
        name: "getTotalTransactions",
        description: "Get the total number of transactions for a specified wallet address on the Sonic blockchain.",
        schema: totalTransactionsSchema,
    }
);

export default getTotalTransactions;