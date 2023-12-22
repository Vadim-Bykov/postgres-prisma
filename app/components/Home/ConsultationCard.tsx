import clsx from "clsx";
import Link from "next/link";
import Button from "../atoms/common/Button";

export function ConsultationCard({ primary }: { primary?: boolean }) {
  return (
    <div
      className={clsx(
        "max-w-sm flex flex-col items-center gap-4 py-10 px-5 md:px-10 text-center",
        "border-2 border-gray-300 rounded-2xl",
        primary ? "bg-primary text-white" : "bg-white"
      )}
    >
      <h3 className="text-[clamp(16px,5vw,30px)] md:text-3xl font-semibold">
        –&nbsp;Профориентация&nbsp;–
      </h3>
      <p className="text-5xl font-semibold">8.700 ₽</p>
      <Link
        href={`/consultation/${1}`}
        className="text-lg text-purple-800 font-medium underline"
      >
        Узнать подробнее
      </Link>
      <Button>Оставить заявку</Button>
    </div>
  );
}
