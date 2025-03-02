import llm from "../createInstance";
import getSymbol from "../tools/chart";
import estimateGas from "../tools/estimate_gas";
import getWalletBalance from "../tools/get_balance";
import getTransactionHistory from "../tools/getTransactionHistory";
import sendSonicToken from "../tools/send_token";
import totalEthSupply from "../tools/totalEthSupply";

export const tools = [getWalletBalance, estimateGas, sendSonicToken, getSymbol, totalEthSupply, getTransactionHistory];
export const toolsByName = Object.fromEntries(tools.map((tool) => [tool.name, tool]));
export const llmWithTools = llm.bindTools(tools);