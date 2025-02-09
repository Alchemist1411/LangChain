import { tool } from "@langchain/core/tools";
import z from "zod";

const multiply = tool(
  async ({ a, b }: { a: number; b: number }) => {
    return (a * b).toString();
  },
  {
    name: "multiply",
    description: "Multiply two numbers together",
    schema: z.object({
      a: z.number().describe("first number"),
      b: z.number().describe("second number"),
    }),
  }
);

export default multiply;