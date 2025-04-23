const hre = require("hardhat");
const { parseUnits, formatUnits } = require("ethers");

async function main() {
  const tokenAddress = "0x46102264Bd95A0349b51006133E87D48880f435f";
  const presaleAddress = "0xBf771C1B262985357E0D11fB67d9D73c33B67cD9";
  const amount = parseUnits("1000000", 18); // 1 million SKYXM

  const [deployer] = await hre.ethers.getSigners();
  const Token = await hre.ethers.getContractAt("SKYMXToken", tokenAddress, deployer);

  const tx = await Token.transfer(presaleAddress, amount);
  await tx.wait();

  console.log(`✅ Transferred ${formatUnits(amount, 18)} SKYXM to Presale`);
}

main().catch((error) => {
  console.error("❌ Error occurred:", error);
  process.exit(1);
});
