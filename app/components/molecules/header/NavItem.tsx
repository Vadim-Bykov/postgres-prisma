import { cn } from "@/utils/css";
import { Pathname, useAppRouter } from "@/utils/useAppRouter";
import clsx from "clsx";

export function NavItem({
  route,
  title,
  isActive,
  onClick,
}: {
  route: Pathname;
  title: string;
  isActive: boolean;
  onClick?: () => void;
}) {
  const { push, isTransitioning } = useAppRouter();
  const handleNAvigation = () => {
    push(route);
    onClick?.();
  };
  return (
    <button
      // href={route}
      className={cn("relative min-w-fit h-full font-head")}
      onClick={handleNAvigation}
    >
      <div
        className={clsx(
          "bg-red w-full h-[6px] absolute -top-2 transition duration-300 scale-0 opacity-100",
          isActive && "scale-100",
          isTransitioning && "animate-pulse-fast bg-slate-700 scale-100"
        )}
      />
      <span className={cn("text-xl text-white")}>{title}</span>
    </button>
  );
}
