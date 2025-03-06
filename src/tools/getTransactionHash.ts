import { tool } from "@langchain/core/tools";
import axios from "axios";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const transactionHashSchema = z.object({
    txhash: z.string().describe("The transaction hash to get details for."),
});

const getTransactionHash = tool(
    async ({ txhash }) => {
        const SONIC_SCAN_API_KEY = process.env.SONIC_SCAN_API_KEY || "";
        const SONIC_SCAN_API_URL = 'https://api.sonicscan.org/api';

        try {
            const response = await axios.get(SONIC_SCAN_API_URL, {
                params: {
                    module: 'proxy',
                    action: 'eth_getTransactionByHash',
                    txhash: txhash,
                    apikey: SONIC_SCAN_API_KEY
                }
            });

            if (response.data.result) {
                const transaction = response.data.result;
                const formattedTx = `
                    Hash: ${transaction.hash}
                    Block Hash: ${transaction.blockHash}
                    Block Number: ${parseInt(transaction.blockNumber, 16)}
                    From: ${transaction.from}
                    To: ${transaction.to}
                    Value: ${parseInt(transaction.value, 16) / 10 ** 18} SONIC
                    Gas: ${parseInt(transaction.gas, 16)}
                    Gas Price: ${parseInt(transaction.gasPrice, 16)} Wei
                    Nonce: ${parseInt(transaction.nonce, 16)}
                    Transaction Index: ${parseInt(transaction.transactionIndex, 16)}
                    Type: ${parseInt(transaction.type, 16)}
                    Chain ID: ${parseInt(transaction.chainId, 16)}
                `;

                return {
                    uiType: "text",
                    text: `Transaction details for hash ${txhash}:\n\n${formattedTx}\n\nRaw transaction data: ${JSON.stringify(transaction, null, 2)}`,
                };
            } else {
                return {
                    uiType: "text",
                    text: `No transaction found for hash ${txhash}.`,
                };
            }
        } catch (error: any) {
            return {
                uiType: "text",
                text: `Failed to fetch transaction details: ${error.message}`,
            };
        }
    },
    {
        name: "getTransactionHash",
        description: "Get the transaction details for a specified transaction hash on the Sonic blockchain.",
        schema: transactionHashSchema,
    }
);

export default getTransactionHash;