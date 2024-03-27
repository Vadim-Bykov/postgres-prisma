import Button from "@/app/components/atoms/common/Button";
import { useSendArticleEmailMutation } from "@/store/features/api/subApi/emailApi";
import { useAppSelector } from "@/store/store";
import clsx from "clsx";
import { useParams } from "next/navigation";
import React from "react";

export function SendEmailButton() {
  const { id } = useParams();
  const [
    sendEmailNotification,
    { isLoading, isError, isSuccess, error, data },
  ] = useSendArticleEmailMutation();
  const role = useAppSelector((state) => state.user.userData?.role);

  if (role !== "ADMIN") {
    return null;
  }

  const onClick = () => {
    sendEmailNotification({ articleId: +id });
  };

  return (
    <div>
      <Button onClick={onClick} disabled={isLoading} loading={isLoading}>
        Отправить уведомление пользователям
      </Button>
      {(isError || isSuccess) && (
        <p
          className={clsx("font-medium", isError ? "text-pink" : "text-purple")}
        >
          {/* @ts-ignore */}
          {data?.message || error?.data?.message || "Error"}
        </p>
      )}
    </div>
  );
}
