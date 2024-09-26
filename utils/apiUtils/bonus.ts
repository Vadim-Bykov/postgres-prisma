import { PERCENTAGE_TO_PAY_BY_BONUS } from "@/app/constants/constants";
import { useGetConsultationQuery } from "@/store/features/api/subApi/consultationApi";
import { useWalletQuery } from "@/store/features/api/subApi/wallet";
import { useEffect } from "react";

type UseBonusToPayType = (consultationId: string) => {
  walletBallance: number;
  allowedToPayByBonus: number;
  sumToPayByBonus: number;
  sumToPayByMoney?: number;
};

export const useBonusToPayConsultation: UseBonusToPayType = (
  consultationId
) => {
  const { data: consultation } = useGetConsultationQuery({
    id: consultationId,
  });
  const { data: wallet, refetch } = useWalletQuery();
  const walletBallance = wallet?.bonusAmount || 0;

  useEffect(() => {
    refetch();
  }, [refetch, consultationId]);

  if (!consultation) {
    return { walletBallance, allowedToPayByBonus: 0, sumToPayByBonus: 0 };
  }

  const { price } = consultation;

  const allowedToPayByBonus = (price * PERCENTAGE_TO_PAY_BY_BONUS) / 100;
  const sumToPayByBonus =
    allowedToPayByBonus > walletBallance ? walletBallance : allowedToPayByBonus;
  const sumToPayByMoney = price - sumToPayByBonus;

  return {
    walletBallance,
    allowedToPayByBonus,
    sumToPayByBonus,
    sumToPayByMoney,
  };
};
