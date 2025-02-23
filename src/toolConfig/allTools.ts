import llm from "../createInstance";
import getSymbol from "../tools/chart";
import estimateGas from "../tools/estimate_gas";
import getWalletBalance from "../tools/get_balance";
import sendSonicToken from "../tools/send_token";
import getRecentTransactionCount from "../tools/transactionCount";
import getRecentTransactionHash from "../tools/transactionHash";

export const tools = [getWalletBalance, estimateGas, sendSonicToken, getSymbol, getRecentTransactionHash, getRecentTransactionCount];
export const toolsByName = Object.fromEntries(tools.map((tool) => [tool.name, tool]));
export const llmWithTools = llm.bindTools(tools);