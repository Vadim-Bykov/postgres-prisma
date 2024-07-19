import { Bonus } from "@prisma/client";

export interface BonusesFromFriend extends Bonus {
  consultationName: string;
}
