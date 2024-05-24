"use client";

import React, { useEffect } from "react";
import {
  ToastContainer,
  ToastContainerProps,
  ToastContent,
  toast,
} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Props extends ToastContainerProps {
  ToastContent: ToastContent;
  show?: boolean;
}

export function Toast({ show, ToastContent, ...props }: Props) {
  useEffect(() => {
    if (show) {
      toast(ToastContent);
    }
  }, [show, ToastContent]);

  return <ToastContainer toastClassName="rounded-lg" {...props} />;
}
