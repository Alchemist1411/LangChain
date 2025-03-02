// src/tokenTopicMapping.ts
export interface TopicMapping {
    topic_id: number;
    topic_name: string;
  }
  
  export const tokenTopicMapping: {
    [key: string]: TopicMapping[];
  } = {
    bitcoin: [
      { topic_id: 4, topic_name: "BTC 24h Prediction" },
      { topic_id: 18, topic_name: "BTC 8h Prediction" },
      { topic_id: 3, topic_name: "BTC 10min Prediction" },
      { topic_id: 42, topic_name: "BTC/USD - 8h Price Prediction" },
      { topic_id: 14, topic_name: "BTC 5min Prediction" },
      { topic_id: 47, topic_name: "BTC 5min Price Prediction 2" },
    ],
    ethereum: [
      { topic_id: 30, topic_name: "ETH/USD - 5min Price Prediction" },
      { topic_id: 2, topic_name: "ETH 24h Prediction 2" },
      { topic_id: 17, topic_name: "ETH 8h Prediction 2" },
      { topic_id: 7, topic_name: "ETH 20min Prediction" },
      { topic_id: 1, topic_name: "ETH 10min Prediction" },
      { topic_id: 13, topic_name: "ETH 5min Prediction" },
      { topic_id: 41, topic_name: "ETH/USD - 8h Price Prediction" },
    ],
    sekoia: [
      { topic_id: 27, topic_name: "Sekoia 5min Price Prediction" },
      { topic_id: 36, topic_name: "Sekoia/USDT - 8h Price Prediction" },
    ],
    aixbt:[
        { topic_id: 23, topic_name: "Aixbt 5min Price Prediction" },
        { topic_id: 32, topic_name: "Aixbt/USDT - 8h Price Prediction" },
    ],
    arbitrum:[
        { topic_id: 29, topic_name: "Arbitrum ETH/USDC Uniswap Pool - 12h Volume Prediction" },
        { topic_id: 9, topic_name: "ARB 20min Prediction" },
    ],
    virtual:[
        { topic_id: 31, topic_name:"Virtual/USDT - 8h Price Prediction" },
    ],
    solana:[
        { topic_id: 6, topic_name: "SOL 24h Prediction" },
        { topic_id: 5, topic_name: "SOL 10min Prediction" },
        { topic_id: 37, topic_name: "SOL/USD - 5min Price Prediction" },
        { topic_id: 38, topic_name: "SOL/USD - 8h Price Prediction" },
    ],
    binance:[
        { topic_id: 8, topic_name: "BNB 20min Prediction" },
    ]
  }
  