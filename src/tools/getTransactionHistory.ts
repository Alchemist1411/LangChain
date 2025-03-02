import { tool } from "@langchain/core/tools";
import { z } from "zod";
import axios from "axios";

const TransactionHistorySchema = z.object({
  walletAddress: z.string().describe("The wallet address to get transaction history for.")
});

const getTransactionHistory = tool(
  async ({ walletAddress }) => {
    try {
      // Define base URL
      const baseUrl = "https://testnet.sonicscan.org/address/";
      
      // Create query parameters
      const params = new URLSearchParams({
        address: walletAddress,
        limit: "10"
      });
      
      // Make the request with dynamic URL
      const response = await axios.get(`${baseUrl}?${params}`, {
        headers: {
          'Accept': 'application/json',
          // Add any required authorization headers here
        }
      });
      
      // Process the response
      const transactions = response.data;
      
      return {
        uiType: "text", // or "chart" or any other UI type you need
        text: `Found ${transactions.length} transactions for wallet ${walletAddress}.`,
        transactions: transactions // Include the transaction data for downstream use
      };
    } catch (error: any) {
      return {
        uiType: "text",
        text: `Failed to retrieve transaction history for ${walletAddress}: ${error.message}`
      };
    }
  },
  {
    name: "getTransactionHistory",
    description: "Get transaction history for a specific wallet address.",
    schema: TransactionHistorySchema,
  }
);

export default getTransactionHistory;