import { ethers } from "ethers";
const rpcUrl = "https://rpc.blaze.soniclabs.com";
const provider = new ethers.JsonRpcProvider(rpcUrl);

export { provider };
