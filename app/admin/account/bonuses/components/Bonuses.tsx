"use client";

import { Coin } from "@/public/icons/Coin";
import { BonusList } from "./BonusList";
import { ExpansesList } from "./ExpansesList";

export function Bonuses() {
  return (
    <div className="w-full max-w-xl flex flex-col gap-6 ">
      <h1 className="text-2xl font-head font-semibold">
        Здесь вы можете просмотреть заработанные и потраченные бонусы{" "}
        <Coin size={24} />
      </h1>

      <BonusList />
      <ExpansesList />
    </div>
  );
}
