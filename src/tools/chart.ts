import { tool } from "@langchain/core/tools";
import { z } from "zod";

const Token = z.object({
  token: z.string().describe("Token name required for the chart."),
});

const getSymbol = tool(
  async ({ token }) => {
    const url = 'https://symbol-search.tradingview.com/symbol_search/';
    const params = new URLSearchParams({
        text: token,
        type: 'stock',
        limit: '1'
    });

    const response = await fetch(`${url}?${params}`, {
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'application/json',
            'Accept-Language': 'en-US,en;q=0.9',
            'Origin': 'https://www.tradingview.com',
            'Referer': 'https://www.tradingview.com/',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-site'
        }
    });
    const results = await response.json();
    const symbol = results[0]?.symbol;
    return {
      uiType: "chart",
      text: `The symbol for ${token} is ${symbol}.`,
      symbol: symbol,
    };
  },
  {
    name: "getSymbol",
    description: "Searches for the TradingView symbol for a given token using Tavily and extracts it from the result.",
    schema: Token,
  }
);

export default getSymbol;
