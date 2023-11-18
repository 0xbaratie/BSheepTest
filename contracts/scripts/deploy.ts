import { formatEther, parseEther } from "viem";
import hre from "hardhat";

async function main() {
  const sheepUp1155 = await hre.viem.deployContract("SheepUp1155", []);

  console.log(`deployed to ${sheepUp1155.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
