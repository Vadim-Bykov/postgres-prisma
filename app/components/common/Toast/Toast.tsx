"use client";

import { memo } from "react";
import { ToastContainer } from "react-toastify";
import { useBonusesToasts } from "./BonusToast";
import { useSignUpPromptToast } from "./SignupPrompt";

// eslint-disable-next-line react/display-name
export const Toast = memo(function () {
  useBonusesToasts();
  useSignUpPromptToast();
  return <ToastContainer toastClassName="rounded-lg" className="lg:w-96" />;
});
