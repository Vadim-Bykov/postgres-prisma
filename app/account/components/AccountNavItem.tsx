import clsx from "clsx";
import Link from "next/link";
import { AccountNavItem } from "./AccountNavigationLayout";
import Icon from "@/app/components/atoms/common/Icon/Icon";
import { toggleLogoutModal } from "@/store/authentication";
import { useAppDispatch } from "@/store/store";

interface Props extends AccountNavItem {
  isTablet?: boolean;
}

export function NavItem({ id, iconSource, text, route, isTablet }: Props) {
  return (
    <Link
      key={id}
      href={route as string}
      className="flex gap-3 items-center relative"
    >
      <Icon name={iconSource} className="relative top-[1px]" />
      <span>{text}</span>
      {isTablet && (
        <span className="flex flex-grow justify-end">
          <Icon name="arrow-right-s-line.svg" size={24} color="purple-light" />
        </span>
      )}
    </Link>
  );
}

export function LogoutNavItem({ id, iconSource, text, isTablet }: Props) {
  const dispatch = useAppDispatch();

  const openLogoutModal = () => {
    dispatch(toggleLogoutModal(true));
  };

  return (
    <div
      className={clsx(
        "flex flex-col relative",
        !isTablet && "flex-grow justify-end"
      )}
    >
      <button
        key={id}
        className="flex gap-3 items-center relative"
        onClick={openLogoutModal}
      >
        <Icon inline name={iconSource} className="relative top-[1px]" />
        <span>{text}</span>
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
