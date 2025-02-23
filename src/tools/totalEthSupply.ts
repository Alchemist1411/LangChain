import { tool } from "@langchain/core/tools";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const totalEthSupply = tool(
    async () => {
        const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";
        const ETHERSCAN_API_URL = 'https://api.etherscan.io/api';

        try {
            const response = await axios.get(ETHERSCAN_API_URL, {
                params: {
                    module: 'stats',
                    action: 'ethsupply',
                    apikey: ETHERSCAN_API_KEY
                }
            });

            if (response.data.status === '1' && response.data.result.length > 0) {
                const totalSupply = response.data.result;
                return {
                    uiType: "text",
                    text: `The total supply of Ethereum is ${totalSupply} ETH.`,
                };
            } else {
                throw new Error('Failed to fetch total supply of Ethereum.');
            }
        }
        catch (error: any) {
            return {
                uiType: "text",
                text: `Failed to fetch total supply of Ethereum: ${error.message}`,
            };
        }
    },
    {
        name: "getTotalEthSupply",
        description: "Get the total supply of Ethereum."
    }
);

export default totalEthSupply;