import {
  Sheepened as SheepenedEvent,
  Shipped as ShippedEvent,
} from "../generated/SheepUp/SheepUp";
import { Sheepened, Shipped } from "../generated/schema";

export function handleSheepened(event: SheepenedEvent): void {
  //bigint to bytes
  let sheepId = event.params.sheepId.toHexString();
  let entity = Sheepened.load(sheepId);
  if (entity == null) {
    entity = new Sheepened(sheepId);
  }

  entity.level = event.params.level;
  entity.shippedAt = event.params.shippedAt;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleShipped(event: ShippedEvent): void {
  let entity = new Shipped(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.sender = event.params.sender;
  entity.level = event.params.level;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}
