import { ethers, providers } from "ethers";
import { parseEther, parseUnits } from "ethers/lib/utils";
import { FlashbotsBundleProvider } from "@flashbots/ethers-provider-bundle";
import { config } from "dotenv";

config();

const RPC_URL = "https://binance.llamarpc.com";
const SUBMISSION_URL = "https://relay-bsc.txboost.io";
const SIMULATION_URL = "https://simulation-bsc.txboost.io";

async function demo() {
  const wallet = new ethers.Wallet(process.env.PRIV_KEY!);
  const provider = new providers.JsonRpcProvider(RPC_URL);

  const flashbotsProvider = await FlashbotsBundleProvider.create(
    provider,
    wallet,
    {
      url: SUBMISSION_URL,
      headers: { Authorization: process.env.AUTHORIZATION! },
    }
  );

  const simulationProvider = await FlashbotsBundleProvider.create(
    provider,
    wallet,
    {
      url: SIMULATION_URL,
      headers: { Authorization: process.env.AUTHORIZATION! },
    }
  );

  const chainId = await provider
    .getNetwork()
    .then((network) => network.chainId);
  const nonce = await provider.getTransactionCount(wallet.address);
  const tx = {
    to: wallet.address,
    value: 0,
    gasLimit: 21000,
    gasPrice: parseUnits("3", "gwei"),
    nonce: nonce,
    chainId: chainId,
  };

  const rawTx = await wallet.signTransaction(tx);
  const target = (await provider.getBlockNumber()) + 1;
  const simulated = await simulationProvider.simulate([rawTx], target);
  console.log(simulated);

  const bundleSubmission = await flashbotsProvider.sendRawBundle(
    [rawTx],
    target
  );

  if ("error" in bundleSubmission) {
    console.error("Bundle submission error:", bundleSubmission.error);
  } else {
    console.log("Bundle submitted, hash:", bundleSubmission.bundleHash);
  }
}

(async () => {
  try {
    await demo();
  } catch (e) {
    console.error(e);
  }
})();
