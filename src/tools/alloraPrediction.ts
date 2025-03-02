import { tool } from "@langchain/core/tools";
import { z } from "zod";
import main from "./allora/allora";

const Token = z.object({
  token: z.string().describe("The token to search for."),
});


const alloraPrediction = tool(
  async ({ token }) => {
    try {
      token = token.toLowerCase();
      const inferences = await main(token);
      return {
        uiType: "alloraPrediction",
        text: `Successfully Predicted price for ${token} `,
        prediction: inferences,
      };
    } catch (error: any) {
      return {
        uiType: "text",
        text: `Failed to predict price: ${error.message}`,
      };
    }
  },
  {
    name: "alloraPrediction",
    description: "Based on the token name provided predict the price using allora sdk also user will prompt like Give prediction for tokenname",
    schema: Token,
  }
);

export default alloraPrediction;
