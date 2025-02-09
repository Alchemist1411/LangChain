import { tool } from "@langchain/core/tools";
import z from "zod";

const add = tool(
    async ({ a, b }: { a: number; b: number }) => {
        return (a + b).toString();
    },
    {
        name: "add",
        description: "Add two numbers together",
        schema: z.object({
            a: z.number().describe("first number"),
            b: z.number().describe("second number"),
        }),
    }
);

export default add;