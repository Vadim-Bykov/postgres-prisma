import AvatarImage from "@/public/icons/avatar.svg";
import { useAppSelector } from "@/store/store";
import Image from "next/image";
import { AccountNavigation } from "./AccountNavigation";
import { MobileHeader } from "./MobileHeader";
import { useWalletQuery } from "@/store/features/api/subApi/wallet";
import { Coin } from "@/public/icons/Coin";

export function MobileAccountNavigation() {
  const { userData } = useAppSelector((state) => state.user);
  const userName = userData?.name ?? "";
  const userEmail = userData?.email ?? "";
  const { data: wallet } = useWalletQuery();
  const walletBallance = wallet?.bonusAmount ?? "--";

  return (
    <section
      className={
        "min-h-[calc(100vh-68px-112px)] flex flex-col items-center px-8 pb-5"
      }
    >
      <MobileHeader />

      <div className="mt-10 mb-14 flex flex-col items-center">
        <div className="mb-4">
          <Image
            priority
            src={AvatarImage}
            alt="Placeholder image for user avatar"
            className="w-24 h-24"
          />
        </div>
        <h1 className="text-2xl font-semibold font-head">{userName}</h1>
        <p className="text-sm">{userEmail}</p>
        <p>
          Бонусы: <Coin />{" "}
          <span className="text-pink font-semibold">{walletBallance}</span>
        </p>
      </div>

      <AccountNavigation isTablet />
    </section>
  );
}
