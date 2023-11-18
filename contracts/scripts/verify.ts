import env from "hardhat";

async function main() {
  await env.run("verify:verify", {
    address: "0x7945f05a65efd85d6d4bc3e4279c3459476f9bee",
    constructorArguments: [],
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
