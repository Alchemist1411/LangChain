import { TavilySearchResults } from "@langchain/community/tools/tavily_search";

const TavilySearch = new TavilySearchResults({
    apiKey: "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",
    maxResults: 2,
});

export default TavilySearch;