import express from 'express';
import dotenv from "dotenv";
import cors from "cors";
import searchRouter from "./routes/tavily";
import agentRouter from "./routes/agent";
import healthCheckRouter from "./routes/healthCheck";
import priceRouter from "./routes/price";

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
dotenv.config();
app.use(cors());

app.use("/v1/agent", agentRouter);
app.use("/v1/tavily", searchRouter);
app.use("/v1/price", priceRouter);
app.use("/", healthCheckRouter);


app.listen(port, () => {
    console.log(`Service is running on port: ${port}`);
});