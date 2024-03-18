import { ethers, providers } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { config } from "dotenv";

config();

const RPC_URL = "https://bsc-dataseed.bnbchain.org";
const BLOCKSMITH_URL = "https://bsc-builder.blocksmith.org";

async function demo() {
  const wallet = new ethers.Wallet(process.env.PRIV_KEY!);
  const provider = new providers.JsonRpcProvider(RPC_URL);

  const privateProvider = new providers.JsonRpcProvider({
    url: BLOCKSMITH_URL,
    headers: { Authorization: process.env.AUTHORIZATION! },
  });

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

  const hash = await privateProvider.perform("sendTransaction", {
    signedTransaction: rawTx,
  });
  console.log(hash);
  const receipt = await provider.waitForTransaction(hash);
  console.log(receipt.status);
}

(async () => {
  try {
    await demo();
  } catch (e) {
    console.error(e);
  }
})();
