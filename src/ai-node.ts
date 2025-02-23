import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { llmWithTools, toolsByName } from "./toolConfig/allTools";
import {
    AIMessage,
    ToolMessage
} from "@langchain/core/messages";

let toolDataMap: Map<string, string> = new Map();

async function llmCall(state: any) {
    const result = await llmWithTools.invoke([
        {
            role: "system",
            content: "You are a helpful assistant tasked with performing on-chain actions on the Ethereum blockchain. Use only tools given to you to get solutions. Always be to the point with your answers.",
        },
        ...state.messages
    ]);

    const aimessage: AIMessage[] = [];

    result.additional_kwargs = {
        uiType: Array.from(toolDataMap.values()),
        toolName: Array.from(toolDataMap.keys())
    };

    return { messages: result };
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
                    content: observation.text,
                    tool_call_id: toolCall.id,
                    additional_kwargs: {
                        toolName: tool.name,
                        uiType: observation.uiType
                    }
                })
            );
            toolDataMap.set(tool.name, observation.uiType);
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

export const agentBuilder = new StateGraph(MessagesAnnotation)
    .addNode("llmCall", llmCall)
    .addNode("tools", toolNode)
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
