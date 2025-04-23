async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const Token = await ethers.getContractFactory("SKYMXToken");
  const token = await Token.deploy();
  await token.deployed();
  console.log("Token deployed to:", token.address);

  const Presale = await ethers.getContractFactory("SKYMXPresale");
  const presale = await Presale.deploy(token.address);
  await presale.deployed();
  console.log("Presale deployed to:", presale.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
