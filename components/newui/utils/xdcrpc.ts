import { ethers } from "ethers";

const getBlockchainData = async (rpcUrl: string) => {
  try {
    // Initialize provider using RPC URL
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

    // Get latest block number
    const latestBlockNumber = await provider.getBlockNumber();

    // Get latest block details
    const latestBlock = await provider.getBlock(latestBlockNumber);
      const totalBlockTransactions = await latestBlock.transactions.length;
    // Get total transactions in the latest block
    const totalTransactions = "325.67M";
    const totalBlocks = await provider.getBlock(latestBlockNumber)
    // You can also get other block data such as:
    const gasUsed = latestBlock.gasUsed.toString();
    const gasLimit = latestBlock.gasLimit.toString();
    const miner = latestBlock.miner;
    const timestamp = latestBlock.timestamp;

    return {
      latestBlockNumber,
        totalTransactions,
      totalBlockTransactions,
      gasUsed,
      gasLimit,
      miner,
      timestamp,
      latestBlock,
    };
  } catch (error) {
    console.error("Error fetching blockchain data:", error);
    throw error;
  }
};

export { getBlockchainData };