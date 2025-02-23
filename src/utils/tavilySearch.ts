import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import dotenv from "dotenv";

dotenv.config();

const TavilySearch = new TavilySearchResults({
    apiKey: process.env.TAVILY_SEARCH_API || "",
    maxResults: 2,
});

export default TavilySearch;