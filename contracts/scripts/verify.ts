import env from "hardhat";

async function main() {
  await env.run("verify:verify", {
    address: "0xab26b5b34632ad68f650b143f32f922abdf8b341",
    constructorArguments: [],
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
