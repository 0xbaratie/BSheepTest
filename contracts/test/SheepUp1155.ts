import {
  loadFixture,
  time,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { getAddress, parseGwei } from "viem";

describe("SheepUp1155", function () {
  const SHEEP_COUNT = 1n;
  const TAP_COUNT = 2n;
  const SHIP_COUNT = 3n;

  async function deployFixture() {
    const [owner, alice] = await hre.viem.getWalletClients();

    const sheepUp1155 = await hre.viem.deployContract("SheepUp1155", []);

    const publicClient = await hre.viem.getPublicClient();

    return {
      sheepUp1155,
      owner,
      alice,
      publicClient,
    };
  }

  describe("Tests", function () {
    it("Mint", async function () {
      const { sheepUp1155, owner, alice } = await loadFixture(deployFixture);

      await sheepUp1155.write.mint();
      await sheepUp1155.write.mint();
      await sheepUp1155.write.mint({ account: alice.account.address });

      //balance
      expect(
        await sheepUp1155.read.balanceOf([owner.account.address, SHEEP_COUNT]),
      ).equals(2n);
      expect(
        await sheepUp1155.read.balanceOf([alice.account.address, SHEEP_COUNT]),
      ).equals(1n);

      //maxcount
      expect(await sheepUp1155.read.currentSheepId()).equals(3n);
    });

    it("Tap", async function () {
      const { sheepUp1155, owner, alice } = await loadFixture(deployFixture);

      await sheepUp1155.write.mint();
      await sheepUp1155.write.mint();
      await sheepUp1155.write.mint();

      //id: 1
      expect((await sheepUp1155.read.sheepStatus([1n]))[0]).equals(0n);
      expect((await sheepUp1155.read.sheepStatus([1n]))[1]).equals(0n);
      await sheepUp1155.write.tap([1n]);
      await sheepUp1155.write.tap([1n]);
      await sheepUp1155.write.tap([1n]);
      expect((await sheepUp1155.read.sheepStatus([1n]))[0]).equals(3n);
      expect((await sheepUp1155.read.sheepStatus([1n]))[1]).equals(0n);
      //expect mint ERC1155
      expect(
        await sheepUp1155.read.balanceOf([owner.account.address, TAP_COUNT]),
      ).equals(3n);

      //id: 3 by alice
      await sheepUp1155.write.tap([3n], { account: alice.account.address });
      await sheepUp1155.write.tap([3n], { account: alice.account.address });
      expect((await sheepUp1155.read.sheepStatus([3n]))[0]).equals(2n);
      //expect mint ERC1155
      expect(
        await sheepUp1155.read.balanceOf([alice.account.address, TAP_COUNT]),
      ).equals(2n);
    });

    it("Ship", async function () {
      const { sheepUp1155, owner } = await loadFixture(deployFixture);

      await sheepUp1155.write.mint();
      await sheepUp1155.write.mint();
      await sheepUp1155.write.mint();

      await sheepUp1155.write.tap([1n]);
      await sheepUp1155.write.tap([1n]);
      await sheepUp1155.write.tap([1n]);
      await sheepUp1155.write.tap([1n]);
      await sheepUp1155.write.tap([1n]);
      expect((await sheepUp1155.read.sheepStatus([1n]))[0]).equals(5n);

      const currentTimestamp = new Date().getTime() / 1000;
      await sheepUp1155.write.ship([1n]);
      expect((await sheepUp1155.read.sheepStatus([1n]))[0]).equals(0n);
      expect(
        Number((await sheepUp1155.read.sheepStatus([1n]))[1]),
      ).approximately(currentTimestamp, 20); //timestamp
      //expect mint ERC1155
      expect(
        await sheepUp1155.read.balanceOf([owner.account.address, SHIP_COUNT]),
      ).equals(1n);
    });

    it("Sheepened Event", async function () {
      const { sheepUp1155, publicClient } = await loadFixture(deployFixture);

      await sheepUp1155.write.mint();

      const hash = await sheepUp1155.write.tap([1n]);
      await publicClient.waitForTransactionReceipt({ hash });

      const sheepenedEvents = await sheepUp1155.getEvents.Sheepened();
      expect(sheepenedEvents[0].args.sheepId).equals(1n);
      expect(sheepenedEvents[0].args.level).equals(1n);
      expect(sheepenedEvents[0].args.shippedAt).equals(0n);
    });

    it("Shipped Event", async function () {
      const { sheepUp1155, owner, publicClient } =
        await loadFixture(deployFixture);

      await sheepUp1155.write.mint();
      await sheepUp1155.write.tap([1n]);
      await sheepUp1155.write.tap([1n]);

      const hash = await sheepUp1155.write.ship([1n]);
      await publicClient.waitForTransactionReceipt({ hash });

      const shippedEvents = await sheepUp1155.getEvents.Shipped();
      expect(
        shippedEvents[0].args.sender?.toString().toLocaleLowerCase(), //lower case
      ).equals(owner.account.address);
      expect(shippedEvents[0].args.level).equals(2n);
    });

    it("Stamina", async function () {
      const { sheepUp1155, owner } = await loadFixture(deployFixture);

      await sheepUp1155.write.mint();

      expect(
        await sheepUp1155.read.getPlayerTapStamina([owner.account.address]),
      ).equals(100n);
      expect(
        await sheepUp1155.read.getPlayerShipStamina([owner.account.address]),
      ).equals(3n);

      await sheepUp1155.write.tap([1n]);
      await sheepUp1155.write.tap([1n]);
      await sheepUp1155.write.tap([1n]);
      expect(
        await sheepUp1155.read.getPlayerTapStamina([owner.account.address]),
      ).equals(97n);

      //reduce to 0
      for (let i = 0; i < 97; i++) {
        await sheepUp1155.write.tap([1n]);
      }
      expect(
        await sheepUp1155.read.getPlayerTapStamina([owner.account.address]),
      ).equals(0n);
      await expect(sheepUp1155.write.tap([1n])).to.be.rejectedWith(
        "Tap cap reached",
      );

      //recover
      await time.increase(108);
      expect(
        await sheepUp1155.read.getPlayerTapStamina([owner.account.address]),
      ).equals(1n);

      //ship
      await time.increase(108);
      expect(
        await sheepUp1155.read.getPlayerTapStamina([owner.account.address]),
      ).equals(2n);

      await sheepUp1155.write.mint();
      await sheepUp1155.write.mint();
      await sheepUp1155.write.tap([2n]);
      await sheepUp1155.write.tap([3n]);
      await sheepUp1155.write.ship([1n]);
      await sheepUp1155.write.ship([2n]);
      await sheepUp1155.write.ship([3n]);
      expect(
        await sheepUp1155.read.getPlayerShipStamina([owner.account.address]),
      ).equals(0n);

      //recover
      await time.increase(3600);
      expect(
        await sheepUp1155.read.getPlayerShipStamina([owner.account.address]),
      ).equals(1n);
      await time.increase(360000);
      expect(
        await sheepUp1155.read.getPlayerShipStamina([owner.account.address]),
      ).equals(3n);
    });

    it("Point", async function () {
      const { sheepUp1155, owner, alice } = await loadFixture(deployFixture);
      await sheepUp1155.write.mint();
      for (let i = 0; i < 20; i++) {
        await sheepUp1155.write.tap([1n]);
      }
      for (let i = 0; i < 10; i++) {
        await sheepUp1155.write.tap([1n], { account: alice.account.address });
      }
      await sheepUp1155.write.ship([1n], { account: alice.account.address });
      expect(await sheepUp1155.read.point([owner.account.address])).equals(20n);
      expect(await sheepUp1155.read.point([alice.account.address])).equals(
        310n,
      );
    });
  });
});
