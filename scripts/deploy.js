async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const Token = await ethers.getContractFactory("SKYMXToken");
  const token = await Token.deploy();
  await token.waitForDeployment(); // ✅ Wait for deployment to complete
  const tokenAddress = await token.getAddress();
  console.log("Token deployed to:", tokenAddress);

  const Presale = await ethers.getContractFactory("SKYMXPresale");
  const presale = await Presale.deploy(tokenAddress);
  await presale.waitForDeployment();
  console.log("Presale deployed to:", await presale.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
