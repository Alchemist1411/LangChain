import { tool } from "@langchain/core/tools";
import axios from "axios";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const contractStatusSchema = z.object({
    txhash: z.string().describe("The transaction hash to check the contract status for."),
});

const checkContractStatus = tool(
    async ({ txhash }) => {
        const SONIC_SCAN_API_KEY = process.env.SONIC_SCAN_API_KEY || "";
        const SONIC_SCAN_API_URL = 'https://api.sonicscan.org/api';

        try {
            const response = await axios.get(SONIC_SCAN_API_URL, {
                params: {
                    module: 'transaction',
                    action: 'getstatus',
                    txhash: txhash,
                    apikey: SONIC_SCAN_API_KEY
                }
            });

            if (response.data.status === '1') {
                const isError = response.data.result.isError === '0' ? false : true;
                const status = isError ? 'Failed' : 'Success';
                let resultText = `Contract status for transaction hash ${txhash}: ${status}`;

                if (isError && response.data.result.errDescription) {
                    resultText += `\nError Description: ${response.data.result.errDescription}`;
                }

                resultText += `\n\nRaw status data: ${JSON.stringify(response.data.result, null, 2)}`;

                return {
                    uiType: "text",
                    text: resultText,
                };
            } else {
                return {
                    uiType: "text",
                    text: `No status found for transaction hash ${txhash}. Message: ${response.data.message || 'No message provided'}`,
                };
            }
        } catch (error: any) {
            return {
                uiType: "text",
                text: `Failed to fetch contract status: ${error.message}`,
            };
        }
    },
    {
        name: "checkContractStatus",
        description: "Check the contract status for a specified transaction hash on the Sonic blockchain.",
        schema: contractStatusSchema,
    }
);

export default checkContractStatus;