import Icon from "@/app/_components/common/Icon/Icon";
import { Link } from "@/app/_components/common/Link";
import { Coin } from "@/public/icons/Coin";
import { toggleLogoutModal } from "@/store/authentication";
import { useAppDispatch } from "@/store/store";
import clsx from "clsx";
import { AccountNavItem } from "./AccountNavigation";

interface NavItemProps extends AccountNavItem {
  isActive: boolean;
  isTablet?: boolean;
}

export function NavItem({
  iconSource,
  text,
  href,
  target,
  isTablet,
  isActive,
}: NavItemProps) {
  return (
    <Link
      href={href}
      withLoader={false}
      withPulse
      target={target}
      className={clsx(
        "text-base text-purple-dark font-normal",
        "flex gap-3 items-center relative px-6 py-2 rounded-[10px]",
        isActive && "bg-gray-light"
      )}
    >
      {iconSource ? (
        <Icon name={iconSource} className="relative -top-px" />
      ) : (
        <Coin size={18} color="#3B3252" />
      )}
      <span>{text}</span>
      {isTablet && (
        <span className="flex flex-grow justify-end">
          <Icon name="arrow-right-s-line.svg" size={24} color="purple-light" />
        </span>
      )}
    </Link>
  );
}

export function LogoutNavItem({ isTablet }: { isTablet?: boolean }) {
  const dispatch = useAppDispatch();

  const openLogoutModal = () => {
    dispatch(toggleLogoutModal(true));
  };
  return (
    <div
      className={clsx(
        "flex flex-col text-red px-6 py-2",
        !isTablet && "flex-grow justify-end"
      )}
    >
      <button className="flex gap-3 items-center" onClick={openLogoutModal}>
        <Icon
          inline
          name="account/logout-box-r-line.svg"
          className="top-px"
          color="red"
        />
        <span>Выйти из аккаунта</span>
        {isTablet && (
          <span className="flex flex-grow justify-end">
            <Icon name="arrow-right-s-line.svg" size={24} color="red" />
          </span>
        )}
      </button>
    </div>
  );
}
