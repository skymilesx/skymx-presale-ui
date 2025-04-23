import { useState } from "react";
import { ethers } from "ethers";
import {
  SKYMX_TOKEN_ADDRESS,
  SKYMX_PRESALE_ADDRESS,
  SKYMX_TOKEN_ABI,
  SKYMX_PRESALE_ABI,
} from "./constants";

function App() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState("0");
  const [token, setToken] = useState(null);
  const [presale, setPresale] = useState(null);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask not detected.");
        return;
      }

      await window.ethereum.request({ method: "eth_requestAccounts" });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const addr = await signer.getAddress();
      setAccount(addr);

      const tokenContract = new ethers.Contract(
        SKYMX_TOKEN_ADDRESS,
        SKYMX_TOKEN_ABI,
        signer
      );
      const presaleContract = new ethers.Contract(
        SKYMX_PRESALE_ADDRESS,
        SKYMX_PRESALE_ABI,
        signer
      );

      setToken(tokenContract);
      setPresale(presaleContract);

      const bal = await tokenContract.balanceOf(addr);
      setBalance(ethers.formatEther(bal));
    } catch (err) {
      console.error("❌ Wallet connection error:", err);
      alert("Failed to connect wallet");
    }
  };

  const buyTokens = async () => {
  try {
    if (!presale) {
      console.error("❌ Presale contract not ready");
      alert("Presale not ready yet.");
      return;
    }

    const tx = await presale.buyTokens({
      value: ethers.parseEther("0.01"),
    });

    console.log("⛽ TX sent:", tx.hash);
    await tx.wait();
    alert("✅ Purchase successful!");

    if (account && token) {
      const bal = await token.balanceOf(account);
      setBalance(ethers.formatEther(bal));
    }
  } catch (err) {
    console.error("❌ Token purchase failed:", err); // ADD this line
    alert(`❌ Purchase failed: ${err.message || "See console for details"}`);
  }
};


  return (
    <div style={{ padding: "2rem" }}>
      <h1>SKYMX Presale DApp</h1>
      <button onClick={connectWallet}>
        {account ? `Connected: ${account}` : "Connect Wallet"}
      </button>
      <p>Your SKYMX Balance: {balance}</p>
      <button onClick={buyTokens} disabled={!presale}>
        Buy Tokens (0.01 ETH)
      </button>
    </div>
  );
}

export default App;
