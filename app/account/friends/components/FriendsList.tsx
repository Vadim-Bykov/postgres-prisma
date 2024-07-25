import { Coin } from "@/public/icons/Coin";
import { useFriendsQuery } from "@/store/features/api/subApi/friend";
import { range } from "lodash-es";
import { FriendCard, FriendCardPlaceholder } from "./FriendCard";

function Placeholder() {
  return range(2).map((index) => <FriendCardPlaceholder key={index} />);
}

export function FriendsList() {
  const { data: friends, isLoading } = useFriendsQuery();

  if (!isLoading && !friends?.length) {
    return (
      <h2 className="font-head text-lg">
        У вас пока еще нет друзей, но вы можете пригласить их и получать бонусы{" "}
        <Coin size={18} />
      </h2>
    );
  }

  if (isLoading) {
    return <Placeholder />;
  }

  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-head text-lg">Ваши друзья:</h2>
      {friends?.map(({ id, friendData: { email, name } }) => {
        return (
          <FriendCard key={id} friendObjectId={id} name={name} email={email} />
        );
      })}
    </div>
  );
}
