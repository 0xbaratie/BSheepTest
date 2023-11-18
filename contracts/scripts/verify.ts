import env from "hardhat";

async function main() {
  await env.run("verify:verify", {
    address: "0xe2c34d76643cc7a79d091821a06e8293053abbfa",
    constructorArguments: [],
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
