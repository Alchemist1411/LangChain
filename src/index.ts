import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { llmWithTools, toolsByName } from "./toolConfig/allTools";
import {
    ToolMessage
} from "@langchain/core/messages";

async function llmCall(state: any) {
    const result = await llmWithTools.invoke([
        {
            role: "system",
            content: "You are a helpful assistant tasked with performing arithmetic on a set of inputs."
        },
        ...state.messages
    ]);

    return {
        messages: [result]
    };
}

async function toolNode(state: any) {
    const results: ToolMessage[] = [];
    const lastMessage = state.messages.at(-1);

    if (lastMessage?.tool_calls?.length) {
        for (const toolCall of lastMessage.tool_calls) {
            const tool = toolsByName[toolCall.name];
            const observation = await tool.invoke(toolCall.args);
            results.push(
                new ToolMessage({
                    content: observation,
                    tool_call_id: toolCall.id,
                })
            );
        }
    }

    return { messages: results };
}

function shouldContinue(state: any) {
    const messages = state.messages;
    const lastMessage = messages.at(-1);

    if (lastMessage?.tool_calls?.length) {
        return "Action";
    }

    return "__end__";
}

const agentBuilder = new StateGraph(MessagesAnnotation)
    .addNode("llmCall", llmCall)
    .addNode("tools", toolNode)
    // Add edges to connect nodes
    .addEdge("__start__", "llmCall")
    .addConditionalEdges(
        "llmCall",
        shouldContinue,
        {
            "Action": "tools",
            "__end__": "__end__",
        }
    )
    .addEdge("tools", "llmCall")
    .compile();

const messages = [{
    role: "user",
    content: "Add 31 and 42."
}];

(async () => {
    const result = await agentBuilder.invoke({ messages });
    console.log(result.messages);
    result.messages.forEach((message: any) => {
        if (message.role === "assistant") {
            console.log("AI Message:", message.content);
        }
    });
})();