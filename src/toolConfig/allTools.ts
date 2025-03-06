import llm from "../createInstance";
import getSymbol from "../tools/chart";
import estimateGas from "../tools/estimate_gas";
import getWalletBalance from "../tools/get_balance";
import getTransactionHistory from "../tools/getTransactionHistory";
import sendSonicToken from "../tools/send_token";
import totalEthSupply from "../tools/totalEthSupply";
import alloraPrediction from "../tools/alloraPrediction";
import getTransactionHash from "../tools/getTransactionHash";
import checkContractStatus from "../tools/checkContractStatus";
import getTotalTransactions from "../tools/getTotalTransactions";

export const tools = [getWalletBalance, estimateGas, sendSonicToken, getSymbol, totalEthSupply, getTransactionHistory, alloraPrediction, getTransactionHash, checkContractStatus, getTotalTransactions];
export const toolsByName = Object.fromEntries(tools.map((tool) => [tool.name, tool]));
export const llmWithTools = llm.bindTools(tools);