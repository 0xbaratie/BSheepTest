import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { getAddress, parseGwei } from "viem";

describe("SheepIt1155", function () {
  async function deployFixture() {
    const [owner, alice] = await hre.viem.getWalletClients();

    const sheepIt1155 = await hre.viem.deployContract("SheepIt1155", []);

    const publicClient = await hre.viem.getPublicClient();

    return {
      sheepIt1155,
      owner,
      alice,
      publicClient,
    };
  }

  describe("Functions", function () {
    it("mint", async function () {
      const { sheepIt1155, owner, alice } = await loadFixture(deployFixture);

      await sheepIt1155.write.mint();
      await sheepIt1155.write.mint();
      await sheepIt1155.write.mint({ account: alice.account.address });

      const balance = await sheepIt1155.read.balanceOf([
        owner.account.address,
        1n,
      ]);
      console.log(balance);
      const balance2 = await sheepIt1155.read.balanceOf([
        alice.account.address,
        1n,
      ]);
      console.log(balance2);

      expect(
        await sheepIt1155.read.balanceOf([owner.account.address, 1n]),
      ).equals(2n);
      expect(
        await sheepIt1155.read.balanceOf([alice.account.address, 1n]),
      ).equals(1n);
    });
  });
});
