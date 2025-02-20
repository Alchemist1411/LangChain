import express from 'express';
import dotenv from "dotenv";
import cors from "cors";
import searchRouter from "./routes/tavily";
import agentRouter from "./routes/agent";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
dotenv.config();
app.use(cors());



app.get("/", (req, res) => {
  res.send("The backend is up and running!");
});

app.use("/v1/agent", agentRouter);
app.use("/v1/tavily", searchRouter);



app.listen(port, () => {
    console.log(`Service is running on port: ${port}`);
});