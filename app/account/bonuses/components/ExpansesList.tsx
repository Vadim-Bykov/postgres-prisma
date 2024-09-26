import { Coin } from "@/public/icons/Coin";
import { useGetAllUserPurchasesQuery } from "@/store/features/api/subApi/purchase";
import { BonusPlaceholder } from "./BonusList";
import { Link } from "@/app/_components/common/Link";

function Expanse({
  title,
  paidByBonus,
}: {
  title: string;
  paidByBonus: number;
}) {
  return (
    <li>
      &bull; купили консультацию{" "}
      <span className="italic font-semibold">&ldquo;{title}&rdquo;</span> и
      оплатив бонусами{" "}
      <span className="text-pink font-semibold">{paidByBonus}</span>{" "}
      <Coin size={20} />
    </li>
  );
}

export function ExpansesList() {
  const { data: purchases, isLoading: isPurchasesLoading } =
    useGetAllUserPurchasesQuery();

  const hasPurchasePaidByBonus = purchases?.some(
    (purchase) => !!purchase.paidByBonus
  );

  if (isPurchasesLoading) {
    return <BonusPlaceholder />;
  }

  return hasPurchasePaidByBonus ? (
    <ul>
      <h2 className="font-head text-lg">Вы израсходовали:</h2>
      {purchases?.map(({ id, paidByBonus, consultation: { title } }) => {
        return paidByBonus ? (
          <Expanse key={id} title={title} paidByBonus={paidByBonus} />
        ) : null;
      })}
    </ul>
  ) : (
    <div>
      <h2 className="font-head text-lg">Вы еще не тратили свои бонусы.</h2>
      <Link href="/consultation" className="text-purple font-semibold">
        Давай начнем!
      </Link>
    </div>
  );
}
