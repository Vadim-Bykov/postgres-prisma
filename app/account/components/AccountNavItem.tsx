import clsx from "clsx";
import Link from "next/link";
import { AccountNavItem } from "./AccountNavigation";
import Icon from "@/app/components/atoms/common/Icon/Icon";
import { useAppDispatch } from "@/store/store";
import { toggleLogoutModal } from "@/store/authentication";

interface NavItemProps extends AccountNavItem {
  isTablet?: boolean;
}

export function NavItem({
  iconSource,
  text,
  href,
  target,
  isTablet,
}: NavItemProps) {
  return (
    <Link
      href={href}
      target={target}
      className="flex gap-3 items-center relative"
    >
      <Icon name={iconSource} className="relative top-px" />
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
      className={clsx("flex flex-col", !isTablet && "flex-grow justify-end")}
    >
      <button className="flex gap-3 items-center" onClick={openLogoutModal}>
        <Icon inline name="account/logout-box-r-line.svg" className="top-px" />
        <span>Log out</span>
        {isTablet && (
          <span className="flex flex-grow justify-end">
            <Icon
              name="arrow-right-s-line.svg"
              size={24}
              color="purple-light"
            />
          </span>
        )}
      </button>
    </div>
  );
}
