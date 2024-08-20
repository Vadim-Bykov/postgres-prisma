import { Coin } from "@/public/icons/Coin";
import {
  useGetUserBonusesQuery,
  useMarkViewedBonusMutation,
} from "@/store/features/api/subApi/bonus";
import { useFriendsQuery } from "@/store/features/api/subApi/friend";
import { useIsLoggedIn } from "@/utils/authorization";
import { formatDate } from "@/utils/formatting";
import { useAppRouter } from "@/utils/useAppRouter";
import { Bonus, Currency } from "@prisma/client";
import { useState } from "react";
import { toast } from "react-toastify";
import Button from "../../atoms/common/Button";

interface BonusToast extends Bonus {
  friendName: string;
  friendEmail: string;
  onClick: () => void;
}

function Content({
  type,
  amount,
  purchasePrice,
  createdAt,
  friendName,
  friendEmail,
  onClick,
}: BonusToast) {
  return (
    <div className="flex flex-col gap-6 text-sm lg:text-base">
      <div className="flex flex-col gap-1">
        <div>
          {type === "FRIEND_S_PURCHASE" ? (
            <span>
              Твой друг {friendName} {friendEmail} принес тебе{" "}
              <span className="text-pink font-semibold">{amount}</span>{" "}
              <Coin size={20} /> купив консультацию{" "}
              <span className="italic">
                {formatDate(createdAt, { dateStyle: "long" })}
              </span>{" "}
              за{" "}
              <span className="font-semibold">
                {purchasePrice} {Currency.RUB}
              </span>
            </span>
          ) : (
            <span>
              Ты заработал{" "}
              <span className="text-pink font-semibold">{amount}</span>{" "}
              <Coin size={20} /> {purchasePrice}
              {type === "REGISTRATION"
                ? "при регистрации"
                : type === "REGISTRATION_WITH_REFERRAL_EMAIL"
                ? "указав и-мейл друга при регистрации"
                : ""}
            </span>
          )}
        </div>
      </div>
      <Button onClick={onClick}>Просмотреть мои бонусы</Button>
    </div>
  );
}

export function BonusToast() {
  useBonusesToasts();

  return null;
}

export const useBonusesToasts = () => {
  const loggedIn = useIsLoggedIn();
  const { push } = useAppRouter();
  const [markViewedBonus] = useMarkViewedBonusMutation();

  const onClick = () => {
    push("/account/bonuses");
    toast.dismiss();
  };
  const [bonusIndex, setBonusIndex] = useState(0);

  const { data: friends, isLoading: isFriendsLoading } = useFriendsQuery(
    undefined,
    { skip: !loggedIn }
  );
  const { data: bonuses, isLoading: isBonusesLoading } = useGetUserBonusesQuery(
    undefined,
    { skip: !loggedIn }
  );

  const allBonusesViewed = bonuses?.every((bonus) => bonus.viewed);

  if (
    isBonusesLoading ||
    isFriendsLoading ||
    !bonuses?.length ||
    !friends ||
    allBonusesViewed
  ) {
    return null;
  }
  const unViewedBonuses = bonuses.filter(({ viewed }) => !viewed);
  const bonusToNotify = unViewedBonuses[bonusIndex];

  if (bonusToNotify && !toast.isActive(`BonusToast-${bonusToNotify.id}`)) {
    const friend = friends?.find(
      (friend) => friend.id === bonusToNotify.friendId
    );
    const friendName = friend?.friendData.name || "";
    const friendEmail = friend?.friendData.email || "";

    toast(
      <Content
        friendName={friendName}
        friendEmail={friendEmail}
        onClick={onClick}
        {...bonusToNotify}
      />,
      {
        autoClose: 10000,
        onClose: () => {
          setBonusIndex((prev) => prev + 1);
          markViewedBonus({ bonusId: bonusToNotify.id });
        },
        toastId: `BonusToast-${bonusToNotify.id}`,
      }
    );
  }
};
