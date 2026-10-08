import { Link } from "@/app/_components/common/Link";
import { Currency } from "@/prisma/enumAdapter";
import { Coin } from "@/public/icons/Coin";
import { useGetUserBonusesQuery } from "@/store/features/api/subApi/bonus";
import { useFriendsQuery } from "@/store/features/api/subApi/friend";
import { formatDate } from "@/utils/formatting";
import { Bonus } from "@prisma/client";
import { range } from "lodash-es";
import Skeleton from "react-loading-skeleton";

export function BonusPlaceholder() {
  return (
    <div className="flex flex-col gap-1">
      <Skeleton width={200} height={30} />
      {range(5).map((index) => (
        <div key={index} className="overflow-hidden rounded-sm">
          <Skeleton width={576} height={30} />
        </div>
      ))}
    </div>
  );
}

function BonusItem({
  type,
  amount,
  purchasePrice,
  createdAt,
  friendName,
  friendEmail,
}: Bonus & { friendName: string; friendEmail: string }) {
  return (
    <li>
      {type === "FRIEND_S_PURCHASE" ? (
        <span>
          &bull; Твой друг {friendName} {friendEmail} принес тебе{" "}
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
          &bull; Ты заработал{" "}
          <span className="text-pink font-semibold">{amount}</span>{" "}
          <Coin size={20} /> {purchasePrice}
          {type === "REGISTRATION"
            ? "при регистрации"
            : type === "REGISTRATION_WITH_REFERRAL_EMAIL"
              ? "указав и-мейл друга при регистрации"
              : ""}
        </span>
      )}
    </li>
  );
}

export function BonusList() {
  const { data: friends } = useFriendsQuery();
  const { data: bonuses, isLoading: isBonusesLoading } =
    useGetUserBonusesQuery();

  if (isBonusesLoading) {
    return <BonusPlaceholder />;
  }

  return !!bonuses?.length ? (
    <ul>
      <h2 className="font-head text-lg">Вы заработали:</h2>
      {bonuses?.map((bonus) => {
        const friend = friends?.find((friend) => friend.id === bonus.friendId);
        const friendName = friend?.friendData.name || "";
        const friendEmail = friend?.friendData.email || "";

        return (
          <BonusItem
            key={bonus.id}
            friendName={friendName}
            friendEmail={friendEmail}
            {...bonus}
          />
        );
      })}
    </ul>
  ) : (
    <div>
      <h2 className="font-head text-lg">
        У вас пока еще нет бонусов, но вы можете пригласить друзей и получать
        бонусы <Coin size={18} />
      </h2>
      <Link href="/bonus-program" className="text-purple font-semibold">
        Узнать как
      </Link>
    </div>
  );
}
