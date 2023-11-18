import env from "hardhat";

async function main() {
  await env.run("verify:verify", {
    address: "0x6da17da9c3757edf610ba2b710885a38383578fc",
    constructorArguments: [],
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
