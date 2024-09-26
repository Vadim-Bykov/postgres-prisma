"use client";

import { useGetUserBonusesQuery } from "@/store/features/api/subApi/bonus";
import { useIsLoggedIn } from "@/utils/authorization";
import dynamic from "next/dynamic";
import { ToastContainer } from "react-toastify";

const BonusToast = dynamic(
  () => import("./BonusToast").then((mod) => mod.BonusToast),
  { ssr: false }
);
const SignUpPromptToast = dynamic(
  () => import("./SignupPrompt").then((mod) => mod.SignUpPromptToast),
  { ssr: false }
);

export const Toast = () => {
  const loggedIn = useIsLoggedIn();
  const { data: bonuses } = useGetUserBonusesQuery(undefined, {
    skip: !loggedIn,
  });

  const bonusesToDisplay = bonuses?.filter(
    ({ viewed, confirmed }) => !viewed && confirmed
  );

  const showBonusToast = bonusesToDisplay && bonusesToDisplay?.length > 0;

  const showSignUpPromptToast = loggedIn === false;

  if (!showBonusToast && !showSignUpPromptToast) {
    return null;
  }

  return (
    <>
      <ToastContainer toastClassName="rounded-lg" className="lg:w-96" />
      {showBonusToast && <BonusToast bonusesToDisplay={bonusesToDisplay} />}
      {showSignUpPromptToast && <SignUpPromptToast />}
    </>
  );
};
