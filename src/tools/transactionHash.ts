import axios from 'axios';
import { tool } from "@langchain/core/tools";
import { z } from "zod";

const transactionHashSchema = z.object({
  address: z.string().describe("The Ethereum address to get the recent transaction hash for."),
});

const getRecentTransactionHash = tool(
  async ({ address }) => {
    const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";
    const ETHERSCAN_API_URL = 'https://api.etherscan.io/api';

    try {
      const response = await axios.get(ETHERSCAN_API_URL, {
        params: {
          module: 'account',
          action: 'txlist',
          address: address,
          startblock: 0,
          endblock: 99999999,
          sort: 'desc',
          apikey: ETHERSCAN_API_KEY
        }
      });

      if (response.data.status === '1' && response.data.result.length > 0) {
        const recentTransactionHash = response.data.result[0].hash;
        return {
          uiType: "text",
          text: `The most recent transaction hash for address ${address} is ${recentTransactionHash}.`,
          transactionHash: recentTransactionHash,
        };
      } else {
        throw new Error('No transactions found for this address.');
      }
    } catch (error: any) {
      return {
        uiType: "text",
        text: `Failed to fetch transaction hash: ${error.message}`,
      };
    }
  },
  {
    name: "getRecentTransactionHash",
    description: "Get the most recent transaction hash for a given Ethereum address.",
    schema: transactionHashSchema,
  }
);

export default getRecentTransactionHash;