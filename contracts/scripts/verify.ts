import env from "hardhat";

async function main() {
  await env.run("verify:verify", {
    address: "0x8edd6e95724b05564039c286a2872c5475ceb8a8",
    constructorArguments: [],
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
