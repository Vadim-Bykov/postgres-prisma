import Icon from "@/app/components/atoms/common/Icon/Icon";
import { IconButton } from "@/app/components/atoms/common/IconButton";
import { useAppSelector } from "@/store/store";
import { useAppPathname, useAppRouter } from "@/utils/useAppRouter";
import clsx from "clsx";
import Link from "next/link";

export function MobileHeader() {
  const { back } = useAppRouter();
  const pathname = useAppPathname();
  const isAccountNavigationPage = pathname === "/account";
  const accountEntryRoute = useAppSelector(
    (state) => state.app.accountEntryRoute ?? "/"
  );

  return (
    <div
      className={clsx(
        "flex lg:hidden justify-between items-center w-screen",
        "py-4 px-5"
      )}
    >
      <IconButton
        iconProps={{ name: "arrow-left.svg" }}
        buttonProps={{
          className: clsx(
            "flex justify-center items-center",
            "w-[34px] h-[34px] opacity-50",
            "border border-purple-dark rounded-full"
          ),
          onClick: back,
        }}
      />
      <span>Мой аккаунт</span>
      {isAccountNavigationPage ? (
        <div className="w-6" />
      ) : (
        <Link href={accountEntryRoute}>
          <Icon name="close-line.svg" size={24} />
        </Link>
      )}
    </div>
  );
}
