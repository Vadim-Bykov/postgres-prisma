import AvatarImage from "@/public/icons/avatar.svg";
import { Coin } from "@/public/icons/Coin";
import { useGetBonusesFromFriendQuery } from "@/store/features/api/subApi/bonus";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";

export function FriendCardPlaceholder() {
  return (
    <div className="overflow-hidden h-32 rounded-2xl">
      <Skeleton width={576} height={128} />
    </div>
  );
}

export function FriendCard({
  friendObjectId,
  name,
  email,
}: {
  friendObjectId: number;
  name: string;
  email: string;
}) {
  const { data: bonusesFromFriend, isLoading } = useGetBonusesFromFriendQuery({
    friendObjectId,
  });

  if (isLoading) {
    return <FriendCardPlaceholder />;
  }

  return (
    <div className="flex items-start gap-3">
      <Image
        priority
        src={AvatarImage}
        alt="Placeholder image for user avatar"
        className="w-12 h-12"
      />
      <div className="text-sm">
        <p>
          <span className="text-purple-light">Имя:</span> {name}
        </p>
        <p>
          <span className="text-purple-light">Email:</span> {email}
        </p>

        <div className="flex flex-col">
          {bonusesFromFriend?.map(({ id, amount, consultationName }) => {
            return (
              <div key={id}>
                <span className="text-purple-light">
                  Купил консультацию{" "}
                  <span className="text-purple-dark">
                    &quot;{consultationName}&quot;
                  </span>{" "}
                  и принес вам:
                </span>{" "}
                <Coin />{" "}
                <span className="text-pink font-semibold">{amount}</span>
              </div>
            );
          })}
          <p className="self-end font-semibold mt-2">
            Итого: <Coin />
            <span className="text-pink">
              {bonusesFromFriend?.reduce(
                (acc, bonuses) => acc + (bonuses.amount || 0),
                0
              )}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
