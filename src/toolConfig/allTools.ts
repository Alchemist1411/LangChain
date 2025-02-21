
import llm from "../createInstance";
import { estimateGas } from "../tools/estimate_gas";
import { getWalletBalance } from "../tools/get_balance";
import { sendSonicToken } from "../tools/send_token";

export const tools = [getWalletBalance, estimateGas, sendSonicToken];
export const toolsByName = Object.fromEntries(tools.map((tool) => [tool.name, tool]));
export const llmWithTools = llm.bindTools(tools);