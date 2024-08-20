import { Bonus } from "@prisma/client";

export interface BonusesFromFriend extends Bonus {
  consultationName: string;
}

export interface ViewedBonusBody {
  bonusId: Bonus["id"];
}
