import { Coin } from "@/public/icons/Coin";
import { useMarkViewedBonusMutation } from "@/store/features/api/subApi/bonus";
import { useFriendsQuery } from "@/store/features/api/subApi/friend";
import { formatDate } from "@/utils/formatting";
import { useAppRouter } from "@/utils/useAppRouter";
import { Bonus, Currency } from "@prisma/client";
import { useState } from "react";
import { toast } from "react-toastify";
import Button from "../common/Button/Button";

interface BonusToast extends Bonus {
  friendName: string;
  friendEmail: string;
  onButtonClick: () => void;
}

function Content({
  type,
  amount,
  purchasePrice,
  createdAt,
  friendName,
  friendEmail,
  onButtonClick,
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
      <Button onClick={onButtonClick}>Просмотреть мои бонусы</Button>
    </div>
  );
}

export const useBonusesToasts = (bonusesToDisplay: Bonus[]) => {
  const { push } = useAppRouter();
  const [markViewedBonus] = useMarkViewedBonusMutation();

  const [bonusIndex, setBonusIndex] = useState(0);

  const { data: friends, isLoading: isFriendsLoading } = useFriendsQuery();

  if (isFriendsLoading) {
    return null;
  }

  const goToWatchDetails = () => {
    push("/account/bonuses");
    toast.dismiss();
  };

  const onCloseAction = (bonusId: number) => {
    setBonusIndex((prev) => prev + 1);
    markViewedBonus({ bonusId });
  };

  const bonusToNotify = bonusesToDisplay[bonusIndex];

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
        onButtonClick={goToWatchDetails}
        {...bonusToNotify}
      />,
      {
        autoClose: 10000,
        onClose: () => onCloseAction(bonusToNotify.id),
        toastId: `BonusToast-${bonusToNotify.id}`,
      }
    );
  }
};

export const BonusToast = ({
  bonusesToDisplay,
}: {
  bonusesToDisplay: Bonus[];
}) => {
  useBonusesToasts(bonusesToDisplay);
  return null;
};
