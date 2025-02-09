import llm from "../createInstance";
import add from "../tools/addTool";
import multiply from "../tools/multiplyTool";

export const tools = [add, multiply];
export const toolsByName = Object.fromEntries(tools.map((tool) => [tool.name, tool]));
export const llmWithTools = llm.bindTools(tools);