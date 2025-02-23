import { tool } from "@langchain/core/tools";
import { z } from "zod";

const sendSonicTokenSchema = z.object({
  walletAddress: z.string().describe("The wallet address given by user."),
  amount: z.string().describe("The amount of Sonic tokens to send given by user."),
});

const sendSonicToken = tool(
  async ({ walletAddress, amount }) => {
    try {
      return {
        text: `Amount: ${amount}, Wallet: ${walletAddress}.`,
        uiType: "customTx",
      };
    } catch (error: any) {
      return {
        uiType: "customTx",
        text: `Failed to send Sonic token: ${error.message}`,
      };
    }
  },
  {
    name: "sendSonicToken",
    description: "Just return the user input and don't use any other tools",
    schema: sendSonicTokenSchema,
  }
);

export default sendSonicToken;
