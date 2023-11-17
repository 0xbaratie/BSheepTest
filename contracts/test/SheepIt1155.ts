import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { getAddress, parseGwei } from "viem";

describe("SheepIt1155", function () {
  const SHEEP_COUNT = 1n;
  const SIT_COUNT = 2n;
  const SHIP_COUNT = 3n;

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

  describe("Tests", function () {
    it("Mint", async function () {
      const { sheepIt1155, owner, alice } = await loadFixture(deployFixture);

      await sheepIt1155.write.mint();
      await sheepIt1155.write.mint();
      await sheepIt1155.write.mint({ account: alice.account.address });

      //balance
      expect(
        await sheepIt1155.read.balanceOf([owner.account.address, SHEEP_COUNT]),
      ).equals(2n);
      expect(
        await sheepIt1155.read.balanceOf([alice.account.address, SHEEP_COUNT]),
      ).equals(1n);

      //maxcount
      expect(await sheepIt1155.read.maxSheepCount()).equals(3n);
    });

    it("Sit", async function () {
      const { sheepIt1155, owner, alice, publicClient } =
        await loadFixture(deployFixture);

      await sheepIt1155.write.mint();
      await sheepIt1155.write.mint();
      await sheepIt1155.write.mint();

      //id: 1
      expect((await sheepIt1155.read.sheepStatus([1n]))[0]).equals(0n);
      expect((await sheepIt1155.read.sheepStatus([1n]))[1]).equals(0n);
      await sheepIt1155.write.sit([1n]);
      await sheepIt1155.write.sit([1n]);
      await sheepIt1155.write.sit([1n]);
      expect((await sheepIt1155.read.sheepStatus([1n]))[0]).equals(3n);
      expect((await sheepIt1155.read.sheepStatus([1n]))[1]).equals(0n);
      //expect mint ERC1155
      expect(
        await sheepIt1155.read.balanceOf([owner.account.address, SIT_COUNT]),
      ).equals(3n);

      //id: 3 by alice
      await sheepIt1155.write.sit([3n], { account: alice.account.address });
      await sheepIt1155.write.sit([3n], { account: alice.account.address });
      expect((await sheepIt1155.read.sheepStatus([3n]))[0]).equals(2n);
      //expect mint ERC1155
      expect(
        await sheepIt1155.read.balanceOf([alice.account.address, SIT_COUNT]),
      ).equals(2n);
    });

    it("Ship", async function () {
      const { sheepIt1155, owner, alice, publicClient } =
        await loadFixture(deployFixture);

      await sheepIt1155.write.mint();
      await sheepIt1155.write.mint();
      await sheepIt1155.write.mint();

      await sheepIt1155.write.sit([1n]);
      await sheepIt1155.write.sit([1n]);
      await sheepIt1155.write.sit([1n]);
      await sheepIt1155.write.sit([1n]);
      await sheepIt1155.write.sit([1n]);
      expect((await sheepIt1155.read.sheepStatus([1n]))[0]).equals(5n);

      const currentTimestamp = new Date().getTime() / 1000;
      await sheepIt1155.write.ship([1n]);
      expect((await sheepIt1155.read.sheepStatus([1n]))[0]).equals(0n);
      expect(
        Number((await sheepIt1155.read.sheepStatus([1n]))[1]),
      ).approximately(currentTimestamp, 20); //timestamp
      //expect mint ERC1155
      expect(
        await sheepIt1155.read.balanceOf([owner.account.address, SHIP_COUNT]),
      ).equals(1n);
    });

    it("Sheepened Event", async function () {
      const { sheepIt1155, owner, alice, publicClient } =
        await loadFixture(deployFixture);

      await sheepIt1155.write.mint();

      const hash = await sheepIt1155.write.sit([1n]);
      await publicClient.waitForTransactionReceipt({ hash });

      const sheepenedEvents = await sheepIt1155.getEvents.Sheepened();
      expect(sheepenedEvents[0].args.sheepId).equals(1n);
      expect(sheepenedEvents[0].args.level).equals(1n);
      expect(sheepenedEvents[0].args.shippedAt).equals(0n);
    });

    it("Shipped Event", async function () {
      const { sheepIt1155, owner, alice, publicClient } =
        await loadFixture(deployFixture);

      await sheepIt1155.write.mint();
      await sheepIt1155.write.sit([1n]);
      await sheepIt1155.write.sit([1n]);

      const hash = await sheepIt1155.write.ship([1n]);
      await publicClient.waitForTransactionReceipt({ hash });

      const shippedEvents = await sheepIt1155.getEvents.Shipped();
      expect(
        shippedEvents[0].args.sender?.toString().toLocaleLowerCase(), //lower case
      ).equals(owner.account.address);
      expect(shippedEvents[0].args.level).equals(2n);
    });
  });
});
