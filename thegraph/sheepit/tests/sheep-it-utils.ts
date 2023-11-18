import { newMockEvent } from "matchstick-as";
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts";
import { Sheepened, Shipped } from "../generated/SheepIt/SheepIt";

export function createSheepenedEvent(
  sheepId: BigInt,
  level: BigInt,
  shippedAt: BigInt
): Sheepened {
  let sheepenedEvent = changetype<Sheepened>(newMockEvent());

  sheepenedEvent.parameters = new Array();

  sheepenedEvent.parameters.push(
    new ethereum.EventParam(
      "sheepId",
      ethereum.Value.fromUnsignedBigInt(sheepId)
    )
  );
  sheepenedEvent.parameters.push(
    new ethereum.EventParam("level", ethereum.Value.fromUnsignedBigInt(level))
  );
  sheepenedEvent.parameters.push(
    new ethereum.EventParam(
      "shippedAt",
      ethereum.Value.fromUnsignedBigInt(shippedAt)
    )
  );

  return sheepenedEvent;
}

export function createShippedEvent(sender: Address, level: BigInt): Shipped {
  let shippedEvent = changetype<Shipped>(newMockEvent());

  shippedEvent.parameters = new Array();

  shippedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  );
  shippedEvent.parameters.push(
    new ethereum.EventParam("level", ethereum.Value.fromUnsignedBigInt(level))
  );

  return shippedEvent;
}
