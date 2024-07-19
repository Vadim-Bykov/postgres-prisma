"use client";

import Icon from "@/app/components/atoms/common/Icon/Icon";
import { IconButton } from "@/app/components/atoms/common/IconButton";
import { PERCENTAGE_FROM_FRIEND_PURCHASE } from "@/app/constants/constants";
import { Coin } from "@/public/icons/Coin";
import { useAppSelector } from "@/store/store";
import CopyToClipboard from "react-copy-to-clipboard";
import { FriendsList } from "./FriendsList";

export function Friends() {
  const userEmail = useAppSelector((state) => state.user.userData?.email ?? "");

  return (
    <div className="w-full max-w-xl flex flex-col gap-6 ">
      <h2 className="text-2xl font-head font-semibold">
        Ваши друзья вам помогают зарабатывать бонусы <Coin size={24} />
      </h2>
      <p className="italic font-semibold">
        &quot;Имей 100{" "}
        <Icon
          inline
          name="account/friends.svg"
          size={20}
          color="purple"
          className="relative top-0.5"
        />{" "}
        друзей и получай больше бонусов&nbsp;
        <Coin size={20} />
        &quot;
      </p>

      <div className="flex flex-col items-start gap-2">
        <p>
          Приглашая друзей, вы расширяете свою сеть контактов. Вы получаете{" "}
          {PERCENTAGE_FROM_FRIEND_PURCHASE}% стоимости от каждой покупки,
          которую сделал ваш друг. Проценты начисляются на ваш счет в виде
          бонусных баллов <Coin />, которыми вы можете оплачивать ваши покупки.
        </p>
        <div>
          <p>
            Чтобы пригласить друга, просто поделитесь с ним своим адресом
            электронной почты, с которым вы зарегистрировались.
          </p>
          {userEmail && (
            <CopyToClipboard text={userEmail}>
              <div className="flex gap-2 mt-2">
                <span>{userEmail}</span>
                <IconButton
                  iconProps={{ name: "file-copy-line.svg", color: "purple" }}
                />
              </div>
            </CopyToClipboard>
          )}
        </div>
      </div>

      <FriendsList />
    </div>
  );
}
